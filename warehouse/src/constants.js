export const HEADER_REQUEST = {
  MACHINE_AUTHEN_KEY: 'x-warehouse-machine-authen-key',
};

export const ERRORS = {
  BAD_REQUEST: 'Bad request',
  NOT_FOUND: 'Not found request',
  INVALID_TOKEN: 'Unauthorized request',
};

export const DEPOSITE_RECEIPT_NUMBER = {
  CHARACTER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  LENGTH: 10,
};

export const INVENTORY_AUDIT = {
  ACTION: {
    ADDED: 'ADDED',
    UPDATED: 'UPDATED',
  },
  STATUS: {
    DEPOSITED: 'DEPOSITED',
    STORED: 'STORED',
    DISPATCHED: 'DISPATCHED',
    PAID: 'PAID',
  },
};
