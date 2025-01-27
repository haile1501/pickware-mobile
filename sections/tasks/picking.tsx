import { Batch } from "@/types/order";
import { neonBlue } from "@/utils/color";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Card,
  Group,
  H4,
  H5,
  H6,
  Progress,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  View,
  XStack,
  Image,
  YGroup,
  YStack,
} from "tamagui";

interface PickingProps {
  batch: Batch;
  setModalOpen: (open: boolean) => void;
}

const currentPosition = "Depot";

export default function Picking(props: PickingProps) {
  const { batch, setModalOpen } = props;
  const [step, setStep] = useState(0);

  return (
    <YStack px={12} gap={24} pt={12} overflow="scroll" minHeight="100%">
      <Card backgroundColor="#fff" width="100%" px={20} py={24}>
        <YStack gap={4}>
          <H5 fontWeight={700}>Batch {batch.shortId}</H5>
          <XStack alignItems="center" gap={12}>
            <Progress value={40} backgroundColor={neonBlue[100]} width="88%">
              <Progress.Indicator
                animation="bouncy"
                backgroundColor={neonBlue[500]}
              />
            </Progress>
            <H6 fontWeight={400}>40%</H6>
          </XStack>

          <H5>Your current position: {currentPosition}</H5>
          <H5>Picking device load: 30 / 50</H5>
          <XStack
            alignItems="center"
            gap={8}
            onPress={() => {
              setModalOpen(true);
            }}
          >
            <FontAwesome size={16} name="list-alt" color={neonBlue[500]} />
            <SizableText fontWeight={500} color={neonBlue[500]}>
              View picklist
            </SizableText>
          </XStack>

          <XStack alignItems="center" gap={8} onPress={() => {}}>
            <FontAwesome size={16} name="map" color={neonBlue[500]} />
            <SizableText fontWeight={500} color={neonBlue[500]}>
              View map
            </SizableText>
          </XStack>
        </YStack>
      </Card>
      <Separator />
    </YStack>
  );
}
