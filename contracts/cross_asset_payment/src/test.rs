#![cfg(test)]

use super::*;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::{token, Address, Env, String};

// ── Helpers ───────────────────────────────────────────────────────────────────

/// Registers a stellar asset token and mints an initial balance to `recipient`.
fn create_token(env: &Env, recipient: &Address, amount: i128) -> Address {
    let token_admin = Address::generate(env);
    let token_address = env
        .register_stellar_asset_contract_v2(token_admin)
        .address();
    token::StellarAssetClient::new(env, &token_address).mint(recipient, &amount);
    token_address
}

fn setup() -> (Env, Address, Address, CrossAssetPaymentContractClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register(CrossAssetPaymentContract, ());
    let client = CrossAssetPaymentContractClient::new(&env, &contract_id);
    client.init(&admin);

    (env, admin, contract_id, client)
}

// ── initiate_payment ──────────────────────────────────────────────────────────

#[test]
fn test_initiate_payment_stores_record_and_transfers_funds() {
    let (env, _admin, contract_id, client) = setup();

    let from = Address::generate(&env);
    let token_address = create_token(&env, &from, 1_000);

    let receiver_id  = String::from_str(&env, "worker-123");
    let target_asset = String::from_str(&env, "EUR");
    let anchor_id    = String::from_str(&env, "anchor-eu");

    let payment_id = client.initiate_payment(
        &from,
        &500,
        &token_address,
        &receiver_id,
        &target_asset,
        &anchor_id,
    );

    assert_eq!(payment_id, 1);

    // Tokens should move from sender → contract
    let tc = token::Client::new(&env, &token_address);
    assert_eq!(tc.balance(&contract_id), 500);
    assert_eq!(tc.balance(&from), 500);

    // Persistent record must be accurate
    let record = client.get_payment(&payment_id).unwrap();
    assert_eq!(record.from,   from);
    assert_eq!(record.amount, 500);
    assert_eq!(record.status, symbol_short!("pending"));
    assert_eq!(record.receiver_id,  receiver_id);
    assert_eq!(record.target_asset, target_asset);
    assert_eq!(record.anchor_id,    anchor_id);
}

#[test]
fn test_initiate_payment_counter_increments() {
    let (env, _admin, _contract_id, client) = setup();

    let from         = Address::generate(&env);
    let token_address = create_token(&env, &from, 10_000);
    let receiver_id  = String::from_str(&env, "r1");
    let target_asset = String::from_str(&env, "USD");
    let anchor_id    = String::from_str(&env, "anc1");

    let id1 = client.initiate_payment(&from, &100, &token_address, &receiver_id, &target_asset, &anchor_id);
    let id2 = client.initiate_payment(&from, &200, &token_address, &receiver_id, &target_asset, &anchor_id);
    let id3 = client.initiate_payment(&from, &300, &token_address, &receiver_id, &target_asset, &anchor_id);

    assert_eq!(id1, 1);
    assert_eq!(id2, 2);
    assert_eq!(id3, 3);
}

// ── update_status ─────────────────────────────────────────────────────────────

#[test]
fn test_update_status_changes_status_in_persistent_storage() {
    let (env, _admin, _contract_id, client) = setup();

    let from          = Address::generate(&env);
    let token_address = create_token(&env, &from, 1_000);

    let payment_id = client.initiate_payment(
        &from,
        &500,
        &token_address,
        &String::from_str(&env, "rec-1"),
        &String::from_str(&env, "USD"),
        &String::from_str(&env, "anc-1"),
    );

    // Default status is "pending"
    assert_eq!(
        client.get_payment(&payment_id).unwrap().status,
        symbol_short!("pending")
    );

    client.update_status(&payment_id, &symbol_short!("success"));

    assert_eq!(
        client.get_payment(&payment_id).unwrap().status,
        symbol_short!("success")
    );
}

#[test]
#[should_panic(expected = "Payment not found")]
fn test_update_status_panics_for_unknown_id() {
    let (_env, _admin, _contract_id, client) = setup();
    client.update_status(&999, &symbol_short!("success"));
}

// ── get_payment ───────────────────────────────────────────────────────────────

#[test]
fn test_get_payment_returns_none_for_unknown_id() {
    let (_env, _admin, _contract_id, client) = setup();
    assert!(client.get_payment(&42).is_none());
}

// ── init ──────────────────────────────────────────────────────────────────────

#[test]
#[should_panic(expected = "Already initialized")]
fn test_init_twice_panics() {
    let (env, admin, _contract_id, client) = setup();
    client.init(&admin); // second init should panic
    let _ = &env;
}
