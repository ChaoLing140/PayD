import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminPanel from '../pages/AdminPanel';

// Mock the wallet hook
vi.mock('../hooks/useWallet', () => ({
  useWallet: () => ({
    address: 'GABC123',
  }),
}));

// Mock the notification hook
vi.mock('../hooks/useNotification', () => ({
  useNotification: () => ({
    notifySuccess: vi.fn(),
    notifyError: vi.fn(),
    notifyApiError: vi.fn(),
  }),
}));

// Mock multisig detector to isolate test
vi.mock('../components/MultisigDetector', () => ({
  default: () => <div data-testid="multisig-detector">Multisig Detector Mock</div>,
}));

// Mock contract upgrade tab
vi.mock('../components/ContractUpgradeTab', () => ({
  default: () => <div data-testid="contract-upgrade-tab">Contract Upgrade Mock</div>,
}));

vi.mock('@stellar/design-system', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Card: ({ children, addlClassName, ...props }: any) => <div className={addlClassName} {...props}>{children}</div>,
  Heading: ({ children }: any) => <h2>{children}</h2>,
  Text: ({ children }: any) => <p>{children}</p>,
  Input: ({ fieldSize, addlInputClassName, ...props }: any) => <input {...props} />,
  Select: ({ children, fieldSize, label, note, ...props }: any) => <select {...props}>{children}</select>,
}));

describe('AdminPanel UI Tests', () => {
  test('renders the AdminPanel security center properly', () => {
    const { getByText } = render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    );

    // Verify main headings are rendered
    expect(getByText(/Security/)).toBeInTheDocument();
    expect(getByText(/Center/)).toBeInTheDocument();
    expect(getByText(/Asset Freeze & Administrative Controls/)).toBeInTheDocument();

    // Verify tabs are present
    expect(getByText('Account Control')).toBeInTheDocument();
    expect(getByText('Global Asset Control')).toBeInTheDocument();
    expect(getByText('Status Check')).toBeInTheDocument();
  });

  test('default tab shows Account Level Freeze', () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    );

    expect(getByText('Account Level Freeze')).toBeInTheDocument();
    expect(getByText('Target Account (Public Key)')).toBeInTheDocument();
    expect(getByPlaceholderText('G...')).toBeInTheDocument();
    
    // Check for the new Stellar Button text
    expect(getByText('Freeze Account')).toBeInTheDocument();
    expect(getByText('Unfreeze Account')).toBeInTheDocument();
  });
});
