import {
  Button,
  Card,
  Group,
  H4,
  H5,
  H6,
  ScrollView,
  Sheet,
  SizableText,
  View,
  XStack,
  YGroup,
  YStack,
  Image,
  Separator,
  Spinner,
} from "tamagui";
import moment from "moment";
import { Batch, BatchStatus } from "@/types/order";
import { green, neonBlue, neutral } from "@/utils/color";
import { FontAwesome } from "@expo/vector-icons";
import { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "@/redux/store";
import {
  getTodayBatches,
  handleSetNewBatchAssigned,
  handleSetUnreadBatchAssigned,
  startPicking,
} from "@/redux/slices/batch";
import { useFocusEffect } from "@react-navigation/native";

export default function Tasks() {
  const { batches, loading, newBatchAssigned } = useSelector(
    (state) => state.batch
  );
  const { user } = useSelector((state) => state.authentication);
  const [openPicklistModal, setOpenPicklistModal] = useState(false);
  const [chosenBatch, setChosenBatch] = useState<Batch | null>(null);
  const [position, setPosition] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const { unreadBatchAssigned } = useSelector((state) => state.batch);

  useEffect(() => {
    if (newBatchAssigned && user?._id) {
      dispatch(getTodayBatches(user._id));
      dispatch(handleSetNewBatchAssigned(false));
    }
  }, [newBatchAssigned]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        dispatch(getTodayBatches(user._id));
      }

      if (unreadBatchAssigned) {
        dispatch(handleSetUnreadBatchAssigned(false));
      }
    }, [dispatch, user, unreadBatchAssigned])
  );

  useEffect(() => {
    setChosenBatch(batches[0]);
  }, [batches]);

  if (loading) {
    return (
      <YStack height="100%" justifyContent="center">
        <Spinner size="large" color={neonBlue[500]} />
      </YStack>
    );
  }

  return (
    <>
      <YStack px={12} gap={24} pt={24} overflow="scroll">
        <XStack alignItems="center" justifyContent="space-between" pr={12}>
          <H5 fontWeight="bold">🌞 Today {moment().format("DD/MM/YYYY")}</H5>
          <FontAwesome
            size={20}
            name="refresh"
            color={neutral[600]}
            onPress={() => {
              if (user) {
                dispatch(getTodayBatches(user._id));
              }
            }}
          />
        </XStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <YStack gap={28} pb={24}>
            {batches.map((batch, index) => (
              <YStack alignItems="center" gap={16} key={index}>
                <Card backgroundColor="#fff" width="100%" px={20} py={24}>
                  <YStack gap={12}>
                    <View>
                      <XStack justifyContent="space-between">
                        <H6 fontWeight={600}>
                          Batch: <H6 fontWeight={400}>{batch.shortId}</H6>
                        </H6>
                        <BatchStatusChip status={batch.status} />
                      </XStack>

                      <H6 fontWeight={600}>
                        Total items:{" "}
                        <H6 fontWeight={400}> {batch.totalItems}</H6>
                      </H6>
                      <H6 fontWeight={600}>
                        Estimated picking time:{" "}
                        <H6 fontWeight={400}>
                          {batch.estimatedPickingTime} minutes
                        </H6>
                      </H6>
                      <H6 fontWeight={600}>
                        Estimated traveling distance:{" "}
                        <H6 fontWeight={400}>
                          {batch.estimatedTravelingDistance} m
                        </H6>
                      </H6>
                    </View>
                    <XStack
                      alignItems="center"
                      gap={8}
                      alignSelf="flex-end"
                      onPress={() => {
                        setChosenBatch(batch);
                        setOpenPicklistModal(true);
                      }}
                    >
                      <FontAwesome size={16} name="eye" color={neonBlue[500]} />
                      <SizableText fontWeight={500} color={neonBlue[500]}>
                        View picklist
                      </SizableText>
                    </XStack>
                  </YStack>
                </Card>
                {batch.status !== BatchStatus.FULFILLED && (
                  <Button
                    fontWeight="bold"
                    backgroundColor={neonBlue[400]}
                    color="#fff"
                    fontSize={14}
                    width={160}
                    onPress={async () => {
                      if (user) {
                        if (batch.status === BatchStatus.PENDING) {
                          await dispatch(startPicking(user._id));
                        }
                        router.push("/tasks/picking");
                      }
                    }}
                  >
                    {batch.status === BatchStatus.PENDING
                      ? "Start picking"
                      : "Continue picking"}
                  </Button>
                )}
              </YStack>
            ))}
          </YStack>
        </ScrollView>
      </YStack>
      <Sheet
        modal
        open={openPicklistModal}
        onOpenChange={setOpenPicklistModal}
        snapPoints={[65]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
        disableDrag
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame>
          <YStack pt={20} px={16} gap={24}>
            <XStack gap={12} alignItems="center">
              <FontAwesome size={24} name="list-alt" color={neonBlue[500]} />
              <H4 fontWeight={600}>
                Picklist for Batch {chosenBatch?.shortId}
              </H4>
            </XStack>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <YGroup gap={16} separator={<Separator />} pb={80}>
                {chosenBatch?.itemToPickSequence.map((pickListItem, index) => (
                  <View key={index}>
                    <Group.Item>
                      <XStack justifyContent="space-between">
                        <XStack gap={12}>
                          <Image
                            src="https://cdn.decrypt.co/wp-content/uploads/2024/11/chillguy-gID_7.jpg"
                            width={75}
                            height={75}
                            borderRadius={17}
                          />
                          <YStack>
                            <H5
                              fontWeight={500}
                              numberOfLines={1}
                              textOverflow="ellipsis"
                              width={160}
                            >
                              {pickListItem.product.name}
                            </H5>
                            <H6 fontWeight={400}>{pickListItem.product.sku}</H6>
                          </YStack>
                        </XStack>
                        <YStack alignItems="center" mr={16}>
                          <H4 fontWeight={400}>{pickListItem.quantity}</H4>
                          <H6 fontWeight={300}>Unit(s)</H6>
                        </YStack>
                      </XStack>
                    </Group.Item>
                  </View>
                ))}
              </YGroup>
            </ScrollView>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}

interface BatchStatusChipProps {
  status: BatchStatus;
}

const chipStyle: Record<BatchStatus, any> = {
  [BatchStatus.PENDING]: {
    bgColor: neutral[200],
    iconColor: neutral[500],
    icon: "circle-o",
    textColor: neutral[600],
    text: "To-do",
  },
  [BatchStatus.FULFILLED]: {
    bgColor: green[400],
    iconColor: neutral[50],
    icon: "check-circle-o",
    textColor: neutral[50],
    text: "Completed",
  },
  [BatchStatus.PICKING]: {
    bgColor: neonBlue[400],
    iconColor: neutral[50],
    icon: "pause-circle-o",
    textColor: neutral[50],
    text: "Picking",
  },
};

function BatchStatusChip(props: BatchStatusChipProps) {
  const { status } = props;

  return (
    <XStack
      gap={8}
      alignItems="center"
      backgroundColor={chipStyle[status].bgColor}
      px={14}
      py={4}
      borderRadius={20}
    >
      <FontAwesome
        size={18}
        name={chipStyle[status].icon}
        color={chipStyle[status].iconColor}
      />
      <SizableText
        fontWeight={600}
        fontSize={14}
        color={chipStyle[status].textColor}
      >
        {chipStyle[status].text}
      </SizableText>
    </XStack>
  );
}
