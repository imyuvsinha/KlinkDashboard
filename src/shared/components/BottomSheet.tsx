import React, {RefObject, useCallback, useMemo} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';

type ActionSheetProps<T> = {
  actionSheetRef: RefObject<BottomSheet>;
  dismiss: () => void;
  children: T;
};
const ActionSheet: React.FC<ActionSheetProps<React.ReactNode>> = ({
  actionSheetRef,
  dismiss,
  children,
}) => {
  const {colors} = useTheme();

  const snapPoints = useMemo(() => ['10%', '30%'], []);

  const renderBackdrop = useCallback(
    props => <BottomSheetBackdrop {...props} onPress={dismiss} />,
    [dismiss],
  );

  return (
    <BottomSheet
      ref={actionSheetRef}
      index={-1}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={dismiss}
      handleStyle={{
        backgroundColor: colors.bottomsheet,
      }}
      handleIndicatorStyle={{backgroundColor: '#4A4948'}}>
      <BottomSheetView
        style={{
          backgroundColor: colors.bottomsheet,
          minHeight: '100%', // Use minHeight instead of height for BottomSheetView
          alignItems: 'center',
          paddingVertical: 10,
          flex: 1, // Replace gap with padding
        }}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ActionSheet;
