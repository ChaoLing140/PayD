#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, token};

#[cfg(test)]
mod test;

#[contracttype]
pub enum DataKey {
    Admin,
    Recipients,
}

#[derive(Clone, Debug, PartialEq, Eq)]
#[contracttype]
pub struct RecipientShare {
    pub destination: Address,
    pub basis_points: u32,
}

pub const TOTAL_BASIS_POINTS: u32 = 10000; // 100%

#[contract]
pub struct RevenueSplitContract;

#[contractimpl]
impl RevenueSplitContract {
    /// Initialize the contract with an admin and an initial set of recipients/shares.
    pub fn init(env: Env, admin: Address, shares: Vec<RecipientShare>) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        
        let mut total_bp = 0;
        for share in shares.iter() {
            total_bp += share.basis_points;
        }
        
        if total_bp != TOTAL_BASIS_POINTS {
            panic!("Shares must sum to 10000 basis points");
        }

        env.storage().instance().set(&DataKey::Admin, &admin);
        
        let recipient_key = DataKey::Recipients;
        env.storage().persistent().set(&recipient_key, &shares);
        // Extend TTL for recipients (1 month initially)
        env.storage().persistent().extend_ttl(&recipient_key, 100_000, 500_000);
    }

    /// Allows the current admin to set a new admin.
    pub fn set_admin(env: Env, new_admin: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &new_admin);
    }

    /// Updates the recipient splits dynamically (admin only).
    pub fn update_recipients(env: Env, new_shares: Vec<RecipientShare>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();

        let mut total_bp = 0;
        for share in new_shares.iter() {
            total_bp += share.basis_points;
        }
        
        if total_bp != TOTAL_BASIS_POINTS {
            panic!("Shares must sum to 10000 basis points");
        }

        let key = DataKey::Recipients;
        env.storage().persistent().set(&key, &new_shares);
        env.storage().persistent().extend_ttl(&key, 100_000, 500_000);
    }

    /// Distributes a specific token amount from a sender to the listed recipients based on their shares.
    pub fn distribute(env: Env, token: Address, from: Address, amount: i128) {
        if amount <= 0 {
             return;
        }
        from.require_auth();
        
        let shares: Vec<RecipientShare> = env.storage().persistent().get(&DataKey::Recipients).expect("Not initialized");
        env.storage().persistent().extend_ttl(&DataKey::Recipients, 100_000, 500_000);
        
        let client = token::Client::new(&env, &token);

        let mut amount_distributed = 0;
        let total_bp = TOTAL_BASIS_POINTS as i128;
        let shares_len = shares.len();

        for (i, share) in shares.iter().enumerate() {
            // Formula: amount * basis_points / 10000
            // We optimize by checking if we are at the last share to dump the precision remainder
            if i as u32 == shares_len - 1 {
                let final_amount = amount - amount_distributed;
                if final_amount > 0 {
                    client.transfer(&from, &share.destination, &final_amount);
                }
            } else {
                let recipient_amount = (amount * share.basis_points as i128) / total_bp;
                if recipient_amount > 0 {
                    client.transfer(&from, &share.destination, &recipient_amount);
                    amount_distributed += recipient_amount;
                }
            }
        }
    }
}
