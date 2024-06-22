import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Check} from 'lucide-react-native';

type IconProps = {
  color: string;
  size: number;
};

type RProps = {
  label: string;
  icon: React.ComponentType<IconProps>;
  onPress: () => void;
  selected: string;
};

export const RadioButton: React.FC<RProps> = ({
  label,
  icon: Icon,
  selected,
  onPress,
}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        borderBottomWidth: 1,
        padding: 15,
        borderBottomColor: colors.border,
      }}
      onPress={onPress}>
      <View style={{marginRight: 10, flexDirection: 'row', gap: 12}}>
        <Icon color={colors.icon} size={24} />
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '400',
            textTransform: 'capitalize',
          }}>
          {label}
        </Text>
      </View>
      <View
        style={{
          height: 24,
          width: 24,
          borderRadius: 12,
          backgroundColor: colors.icon,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {selected === label ? <Check color={colors.white} size={12} /> : null}
      </View>
    </TouchableOpacity>
  );
};
