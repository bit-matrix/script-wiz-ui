export const TX_TEMPLATE_ERROR_MESSAGE = {
  PREVIOUS_TX_ID_ERROR: 'Invalid previous tx id!',
  VOUT_ERROR: 'Invalid vout!',
  SEQUENCE_ERROR: {
    INVALID: 'Invalid sequence!',
    VERSION: 'Version must be greater than 1',
    FLAG: 'Disable flag must be 0',
    AGE_TIMESTAMP: 'Age must not be bigger than block timestamp',
    AGE_HEIGHT: 'Age must not be bigger than block height',
  },
  SCRIPT_PUB_KEY_ERROR: 'Invalid script pub key!',
  AMOUNT_ERROR: 'Invalid amount!',
  INPUT_ASSET_ID_ERROR: 'Invalid input asset id!',
  OUTPUT_ASSET_ID_ERROR: 'Invalid output asset id!',
  VERSION_ERROR: 'Invalid version!',
  TIMELOCK_ERROR: 'Invalid timelock!',
};
