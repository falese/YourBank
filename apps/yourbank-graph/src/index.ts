import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # the yourbank graph
  type User {
    id: ID!
    name: String!
    email: String!
    accounts: [Account!]
  }
  
  type Account {
    id: ID!
    accountNumber: String!
    balance: Float!
    type: AccountType!
    owner: User!
    authorized: [User]
    entitlements: [Entitlement!]
  }
  
  enum AccountType {
    CHECKING
    SAVINGS
    LOAN
    INVESTMENT
    DIGITAL
  }
  
  type FinancialProduct {
    id: ID!
    name: String!
    description: String!
    eligibilityCriteria: String!
  }
  
  type DigitalProduct {
    id: ID!
    name: String!
    description: String!
    eligibilityCriteria: String!
    accessChannel: AccessChannel
  
  }
  
  enum AccessChannel{
   API
   MOBILE
   DESKTOP
   ERP
   THIRDPARTY
  
  }
  
  type Entitlement {
    id: ID!
    account: Account!
    product: FinancialProduct!
    status: EntitlementStatus!
  }
  
  enum EntitlementStatus {
    PENDING
    ACTIVE
    SUSPENDED
    REVOKED
  }
  
  type Query {
    getUser(id: ID!): User
    getAccount(id: ID!): Account
    getAllFinancialProducts: [FinancialProduct!]
    getEntitlementsByAccountId(accountId: ID!): [Entitlement!]
  }
  
  type Mutation {
    createUser(name: String!, email: String!): User!
    createAccount(userId: ID!, accountNumber: String!, type: AccountType!): Account!
    assignProductToAccount(accountId: ID!, productId: ID!): Entitlement!
    updateEntitlementStatus(entitlementId: ID!, status: EntitlementStatus!): Entitlement!
  }type User {
    id: ID!
    name: String!
    email: String!
    accounts: [Account!]
  }
  
`;
const resolvers = {
    Query: {
      getUser: (_, { id }) => {
        return users.find(user => user.id === id);
      },
      getAccount: (_, { id }) => {
        return accounts.find(account => account.id === id);
      },
      getAllFinancialProducts: () => {
        return financialProducts;
      },
      getEntitlementsByAccountId: (_, { accountId }) => {
        return entitlements.filter(entitlement => entitlement.account.id === accountId);
      },
    },
    Mutation: {
      createUser: (_, { name, email }) => {
        const newUser = {
          id: `u${users.length + 1}`, // simple id generation
          name,
          email,
          accounts: []
        };
        users.push(newUser);
        return newUser;
      },
      createAccount: (_, { userId, accountNumber, type }) => {
        const newAccount = {
          id: `a${accounts.length + 1}`, // simple id generation
          accountNumber,
          balance: 0, // starting balance is 0
          type,
          owner: users.find(user => user.id === userId),
          entitlements: []
        };
        accounts.push(newAccount);
        newAccount.owner.accounts.push(newAccount);
        return newAccount;
      },
      assignProductToAccount: (_, { accountId, productId }) => {
        const account = accounts.find(account => account.id === accountId);
        const product = financialProducts.find(product => product.id === productId);
        const newEntitlement = {
          id: `e${entitlements.length + 1}`, // simple id generation
          account,
          product,
          status: EntitlementStatus.PENDING // default to pending
        };
        entitlements.push(newEntitlement);
        account.entitlements.push(newEntitlement);
        return newEntitlement;
      },
      updateEntitlementStatus: (_, { entitlementId, status }) => {
        const entitlement = entitlements.find(e => e.id === entitlementId);
        entitlement.status = status;
        return entitlement;
      }
    },
    User: {
      accounts: (user) => {
        return accounts.filter(account => account.owner.id === user.id);
      }
    },
    Account: {
      owner: (account) => {
        return users.find(user => user.id === account.owner.id);
      },
      entitlements: (account) => {
        return entitlements.filter(entitlement => entitlement.account.id === account.id);
      }
    },
    Entitlement: {
      account: (entitlement) => {
        return accounts.find(account => account.id === entitlement.account.id);
      },
      product: (entitlement) => {
        return financialProducts.find(product => product.id === entitlement.product.id);
      }
    }
  };


type User = {
    id: string;
    name: string;
    email: string;
    accounts: Account[];
};

type Account = {
    id: string;
    accountNumber: string;
    balance: number;
    type: AccountType;
    owner: User;
    entitlements: Entitlement[];
};

enum AccountType {
    CHECKING = "CHECKING",
    SAVINGS = "SAVINGS",
    LOAN = "LOAN"
}

type FinancialProduct = {
    id: string;
    name: string;
    description: string;
    eligibilityCriteria: string;
};

type Entitlement = {
    id: string;
    account: Account;
    product: FinancialProduct;
    status: EntitlementStatus;
};

enum EntitlementStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    REVOKED = "REVOKED"
}

// Mock data
const users: User[] = [
    {
        id: "u1",
        name: "John Doe",
        email: "john.doe@example.com",
        accounts: []
    },
    {
        id: "u2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        accounts: []
    }
];

const accounts: Account[] = [
    {
        id: "a1",
        accountNumber: "123456789",
        balance: 1500.00,
        type: AccountType.CHECKING,
        owner: users[0],
        entitlements: []
    },
    {
        id: "a2",
        accountNumber: "987654321",
        balance: 3000.00,
        type: AccountType.SAVINGS,
        owner: users[1],
        entitlements: []
    }
];

const financialProducts: FinancialProduct[] = [
    {
        id: "p1",
        name: "Premium Checking Account",
        description: "A checking account with minimum balance requirements and added benefits.",
        eligibilityCriteria: "Minimum balance of $1000"
    },
    {
        id: "p2",
        name: "Basic Savings Account",
        description: "A savings account with no minimum balance and a standard interest rate.",
        eligibilityCriteria: "No minimum balance required"
    }
];

const entitlements: Entitlement[] = [
    {
        id: "e1",
        account: accounts[0],
        product: financialProducts[0],
        status: EntitlementStatus.ACTIVE
    },
    {
        id: "e2",
        account: accounts[1],
        product: financialProducts[1],
        status: EntitlementStatus.PENDING
    }
]



const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 8888 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);