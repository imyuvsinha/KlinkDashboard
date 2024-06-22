import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {useTheme} from '@react-navigation/native';
import Portfolio from './PortFolio';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import ActionSheet from '../shared/components/BottomSheet';
import {RadioButton} from '../shared/components/RadioButton';
import {
  ArrowDownZAIcon,
  ArrowUp01Icon,
  ArrowUpAZIcon,
  Bell,
} from 'lucide-react-native';
import {LineChart} from 'react-native-gifted-charts';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: string;
}

const HomeScreen: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>('value');
  const actionSheetRef = useRef<BottomSheet>(null);
  const [bitcoinData, setBitcoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {colors} = useTheme();

  useEffect(() => {
    const loadAssets = async () => {
      const data = await fetchAssets();
      setAssets(data);
    };

    const loadBitcoinData = async () => {
      const data = await fetchBitcoinData();
      console.log({data});
      const formattedData = data.map(([timestamp, value]) => ({
        value,
        label: new Date(timestamp).toLocaleDateString(),
      }));
      console.log({formattedData});
      setBitcoinData(formattedData);
    };

    loadAssets();
    loadBitcoinData();
  }, []);

  const dismiss = () => {
    actionSheetRef?.current?.close();
  };
  const open = () => {
    actionSheetRef.current?.expand();
  };

  const fetchBitcoinData = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
        {
          params: {
            vs_currency: 'usd',
            days: '30', // Fetch data for the last 30 days
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {vs_currency: 'usd'},
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSortBottomsheet = () => {
    open();
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    dismiss();
    let sortedAssets = [...assets];

    if (option === 'value') {
      sortedAssets.sort((a, b) => b.current_price - a.current_price);
    } else if (option === 'A-Z') {
      sortedAssets.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'Z-A') {
      sortedAssets.sort((a, b) => b.name.localeCompare(a.name));
    }

    setAssets(sortedAssets);
  };
  const data = [
    {value: 50},
    {value: 80},
    {value: 90},
    {value: 70},
    {value: 50},
    {value: 80},
    {value: 90},
    {value: 70},
  ];
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.background}
      />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator animating={loading} size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceText}>Wallet Balance</Text>
            </View>
            <TouchableOpacity style={{flexDirection: 'row', gap: 4}}>
              <Bell color={colors.icon} />
              <Text
                style={{color: colors.icon, fontSize: 14, fontWeight: '600'}}>
                Notifications
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>$1000.00</Text>
          <Text style={styles.balanceChange}>▲ 12% Wed, Jun 14, 23:00</Text>

          <LineChart
            areaChart
            data={data}
            rotateLabel
            labelsExtraHeight={20}
            hideDataPoints
            spacing={Dimensions.get('window').width / data.length - 2}
            color={colors.primary}
            thickness={2}
            startFillColor={colors.icon}
            endFillColor="#1e2923"
            startOpacity={0.9}
            endOpacity={0.2}
            initialSpacing={0}
            hideYAxisText={true}
            rulesType="solid"
            rulesColor={colors.background}
            xAxisColor={colors.primary}
            pointerConfig={{
              pointerStripHeight: 140,
              pointerStripColor: 'lightgray',
              pointerStripWidth: 2,
              pointerColor: 'lightgray',
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              // eslint-disable-next-line react/no-unstable-nested-components
              pointerLabelComponent: (items: any) => {
                return (
                  <View
                    style={{
                      height: 90,
                      width: 100,
                      justifyContent: 'center',
                      marginTop: -30,
                      marginLeft: -40,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        marginBottom: 6,
                        textAlign: 'center',
                      }}>
                      {items[0].value}
                    </Text>

                    <View
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                        borderRadius: 16,
                        backgroundColor: 'white',
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          textAlign: 'center',
                          color: 'black',
                        }}>
                        {'$' + items[0].value.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              },
            }}
          />
          <View style={styles.actionButtons}>
            {['Buy', 'Deposit', 'Swap', 'Withdraw'].map(action => (
              <TouchableOpacity
                key={action}
                style={[styles.button, {backgroundColor: colors.primary}]}>
                <Text style={styles.buttonText}>{action}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Portfolio
            expanded={expanded}
            setExpanded={setExpanded}
            handleOpenSortBottomsheet={handleOpenSortBottomsheet}
            assets={assets}
          />
          <ActionSheet actionSheetRef={actionSheetRef} dismiss={dismiss}>
            <View style={{flex: 1, width: '100%'}}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 21,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Sort By
              </Text>
              <View style={{marginTop: 10}}>
                <RadioButton
                  label="value"
                  onPress={() => handleSort('value')}
                  icon={ArrowUp01Icon}
                  selected={sortOption}
                />
                <RadioButton
                  label="A-Z"
                  onPress={() => handleSort('A-Z')}
                  icon={ArrowUpAZIcon}
                  selected={sortOption}
                />
                <RadioButton
                  label="Z-A"
                  onPress={() => handleSort('Z-A')}
                  icon={ArrowDownZAIcon}
                  selected={sortOption}
                />
              </View>
            </View>
          </ActionSheet>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  balanceContainer: {
    flexDirection: 'column',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  balanceChange: {
    fontSize: 14,
    color: '#12DD12',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
