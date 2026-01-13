import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['eatdineadmin://', 'exp+eatdine-partner://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
        },
      },
      Main: {
        screens: {
          Dashboard: 'dashboard',
          Orders: 'orders',
          Menu: 'menu',
          Settings: 'settings',
        },
      },
    },
  },
};

export default linking;
