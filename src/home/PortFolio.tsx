import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Easing,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useTheme} from '@react-navigation/native';
import {ArrowDownWideNarrow, ListCollapse, Rows2} from 'lucide-react-native';
import {Switch} from '../shared/components/Switch';

interface Asset {
  image: string | undefined;
  id: string;
  name: string;
  symbol: string;
  current_price: number;
}

interface PortfolioProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  assets: Asset[];
  handleOpenSortBottomsheet: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({
  expanded,
  setExpanded,
  assets,
  handleOpenSortBottomsheet,
}) => {
  const {colors} = useTheme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animatedValue = new Animated.Value(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animatedSwitchValue = new Animated.Value(expanded ? 1 : 0);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 0],
  });

  useEffect(() => {
    if (assets && assets.length > 0) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [animatedValue, assets]);

  useEffect(() => {
    Animated.timing(animatedSwitchValue, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [animatedSwitchValue, expanded]);

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.background],
  });

  const renderHeader = () => (
    <View style={styles.portfolioHeader}>
      <Text style={[styles.portfolioText, {color: colors.white}]}>
        Portfolio
      </Text>
      <View style={styles.headerActions}>
        <Animated.View style={{backgroundColor: trackColor}}>
          <Switch
            value={expanded}
            onValueChange={() => setExpanded(!expanded)}
            trackColor={{false: colors.border, true: colors.border}}
            thumbColor={colors.primary}
            icon={expanded ? ListCollapse : Rows2}
          />
        </Animated.View>
        <TouchableOpacity
          onPress={handleOpenSortBottomsheet}
          style={styles.sortButton}>
          <Text style={{color: colors.white}}>Sort</Text>
          <ArrowDownWideNarrow color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({item}: {item: Asset}) => {
    const animatedStyle = {
      transform: [{translateY}],
    };
    if (expanded) {
      return (
        <Animated.View
          style={[
            styles.assetListCard,
            animatedStyle,
            {borderColor: colors.border},
          ]}>
          <View style={styles.assetInfo}>
            <Image source={{uri: item.image}} style={styles.assetIcon} />
            <Text style={styles.assetName}>{item.name}</Text>
          </View>
          <Text style={[styles.assetPrice, {color: colors.white}]}>
            ${item.current_price.toFixed(5)}
          </Text>
        </Animated.View>
      );
    } else {
      return (
        <Animated.View
          style={[
            styles.assetCard,
            animatedStyle,
            {borderColor: colors.border},
          ]}>
          <View style={styles.assetDetails}>
            <View style={styles.assetInfo}>
              <Image source={{uri: item.image}} style={styles.assetIcon} />
              <View>
                <Text style={styles.assetName}>{item.name}</Text>
                <Text style={[styles.assetCode, {color: colors.gray}]}>
                  {item.symbol.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={[styles.assetPrice, {color: colors.white}]}>
              ${item.current_price.toFixed(2)}
            </Text>
          </View>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{data: Array(6).fill(item.current_price)}],
            }}
            width={Dimensions.get('window').width - 80}
            height={120}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: '#000000',
              backgroundGradientFrom: '#1F1F1F',
              backgroundGradientTo: '#1F1F1F',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {borderRadius: 16},
              propsForDots: {r: '0', strokeWidth: '0', stroke: '#ffa726'},
            }}
            bezier
            style={styles.chart}
          />
        </Animated.View>
      );
    }
  };

  return (
    <FlatList
      data={expanded ? assets : assets.slice(0, 15)}
      keyExtractor={item => item.id}
      ListHeaderComponent={renderHeader}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  portfolioHeader: {
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  portfolioText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assetCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  assetListCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  assetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  assetCode: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  assetPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Portfolio;
// const AnimatedSwitch = ({
//   value,
//   onValueChange,
//   trackColor,
//   thumbColor,
//   ios_backgroundColor,
//   animatedTrackColor,
// }) => {
//   return (
//     <Animated.View style={{backgroundColor: animatedTrackColor}}>
//       <Switch
//         value={value}
//         onValueChange={onValueChange}
//         trackColor={trackColor}
//         thumbColor={thumbColor}
//         ios_backgroundColor={ios_backgroundColor}
//       />
//     </Animated.View>
//   );
// };
