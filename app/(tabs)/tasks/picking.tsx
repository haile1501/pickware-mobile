import {
  completeCurrentBatch,
  getPickingBatch,
  pickedCurrentItem,
} from "@/redux/slices/batch";
import { useDispatch, useSelector } from "@/redux/store";
import { green, neonBlue, neutral } from "@/utils/color";
import { FontAwesome } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
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
  Checkbox,
  Button,
} from "tamagui";

export default function Picking() {
  const [step, setStep] = useState(0);
  const { user } = useSelector((state) => state.authentication);
  const [openPicklistModal, setOpenPicklistModal] = useState(false);
  const [position, setPosition] = useState(0);
  const [itemChecked, setItemChecked] = useState(false);
  const { currentBatch: batch } = useSelector((state) => state.batch);
  const dispatch = useDispatch();
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(getPickingBatch(user._id));
    }
  }, [user, dispatch]);

  const hasStep3 = useCallback(() => {
    if (
      batch &&
      batch.itemToPickSequence.length - 1 > batch.currentItemIndexToPick
    ) {
      if (
        batch.itemToPickSequence[batch.currentItemIndexToPick].aisle !==
        batch.itemToPickSequence[batch.currentItemIndexToPick + 1].aisle
      ) {
        return true;
      }
    }

    return false;
  }, [batch?.currentItemIndexToPick]);

  if (batch === null) {
    return <></>;
  }

  const currentPosition =
    batch.currentItemIndexToPick === 0
      ? "Depot"
      : `Block ${
          batch?.itemToPickSequence[batch.currentItemIndexToPick - 1].block
        }, Aisle ${
          batch?.itemToPickSequence[batch.currentItemIndexToPick - 1]?.aisle !==
          undefined
            ? batch.itemToPickSequence[batch.currentItemIndexToPick - 1].aisle +
              1
            : "N/A"
        }, Row ${
          batch?.itemToPickSequence[batch.currentItemIndexToPick - 1]?.row !==
          undefined
            ? batch.itemToPickSequence[batch.currentItemIndexToPick - 1].row + 1
            : "N/A"
        }`;

  return (
    <>
      <YStack px={12} gap={16} pt={16} overflow="scroll" minHeight="100%">
        <Card backgroundColor="#fff" width="100%" px={20} py={24}>
          <YStack gap={4}>
            <H5 fontWeight={700}>Batch {batch?.shortId}</H5>
            <XStack alignItems="center" gap={12}>
              <Progress
                value={Math.round(
                  ((batch.currentItemIndexToPick + 1) /
                    (batch?.totalItems || 1)) *
                    100
                )}
                backgroundColor={neonBlue[100]}
                width="88%"
              >
                <Progress.Indicator
                  animation="bouncy"
                  backgroundColor={neonBlue[500]}
                />
              </Progress>
              <H6 fontWeight={400}>
                {Math.round(
                  ((batch.currentItemIndexToPick + 1) /
                    (batch?.totalItems || 1)) *
                    100
                )}
                %
              </H6>
            </XStack>
            <YStack mt={4}>
              <H6 fontWeight={500}>Your current position: {currentPosition}</H6>
              <H6 fontWeight={500}>
                {`Picking device load: ${batch.currentItemIndexToPick} / ${batch?.totalItems}`}
              </H6>
            </YStack>
            <XStack gap={24} mt={8}>
              <XStack
                alignItems="center"
                gap={8}
                onPress={() => {
                  setOpenPicklistModal(true);
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
            </XStack>
          </YStack>
        </Card>
        {!isFinished && (
          <Card backgroundColor="#fff" width="100%" px={20} py={24}>
            <YStack gap={4}>
              <H5 fontWeight={700}>Instructions</H5>
              <YStack mt={8}>
                {batch.currentItemIndexToPick <
                batch.itemToPickSequence.length ? (
                  <>
                    <H6 fontWeight={500}>
                      (1) Go to block{" "}
                      {
                        batch?.itemToPickSequence[batch.currentItemIndexToPick]
                          .block
                      }
                      , aisle{" "}
                      {batch?.itemToPickSequence[batch.currentItemIndexToPick]
                        ?.aisle !== undefined
                        ? batch.itemToPickSequence[batch.currentItemIndexToPick]
                            .aisle + 1
                        : "N/A"}
                      , row{" "}
                      {batch?.itemToPickSequence[batch.currentItemIndexToPick]
                        ?.row !== undefined
                        ? batch.itemToPickSequence[batch.currentItemIndexToPick]
                            .row + 1
                        : "N/A"}
                    </H6>
                    <H6 fontWeight={500}>
                      (2) Pick{" "}
                      {
                        batch?.itemToPickSequence[batch.currentItemIndexToPick]
                          .quantity
                      }{" "}
                      units of{" "}
                      {
                        batch?.itemToPickSequence[batch.currentItemIndexToPick]
                          .product.name
                      }
                    </H6>
                    {hasStep3() && (
                      <H6 fontWeight={500}>
                        (3) Go straight ahead to the end of aisle
                      </H6>
                    )}
                  </>
                ) : (
                  <H6 fontWeight={500}>Back to depot</H6>
                )}
              </YStack>
              {batch.currentItemIndexToPick <
                batch.itemToPickSequence.length && (
                <XStack justifyContent="space-between" mt={16}>
                  <XStack gap={12}>
                    <Image
                      src="https://cdn.decrypt.co/wp-content/uploads/2024/11/chillguy-gID_7.jpg"
                      width={75}
                      height={75}
                      borderRadius={10}
                    />
                    <YStack>
                      <H5
                        fontWeight={500}
                        numberOfLines={1}
                        textOverflow="ellipsis"
                        width={160}
                      >
                        {batch?.itemToPickSequence[0].product.name}
                      </H5>
                      <H6 fontWeight={400}>
                        {batch?.itemToPickSequence[0].product.sku}
                      </H6>
                    </YStack>
                  </XStack>

                  <XStack gap={16} mr={8} alignItems="center">
                    <YStack alignItems="center">
                      <H4 fontWeight={400}>
                        {batch?.itemToPickSequence[0].quantity}
                      </H4>
                      <H6 fontWeight={300}>Unit(s)</H6>
                    </YStack>
                    <Checkbox
                      size="$6"
                      checked={itemChecked}
                      onCheckedChange={(checked) =>
                        setItemChecked(checked as boolean)
                      }
                    >
                      <Checkbox.Indicator>
                        <FontAwesome
                          size={24}
                          name="check"
                          color={neonBlue[600]}
                        />
                      </Checkbox.Indicator>
                    </Checkbox>
                  </XStack>
                </XStack>
              )}
              {batch.currentItemIndexToPick <
              batch.itemToPickSequence.length ? (
                <XStack gap={20} alignSelf="center" mt={40}>
                  {batch && batch.currentItemIndexToPick > 0 && (
                    <Button
                      fontWeight="bold"
                      backgroundColor={neonBlue[400]}
                      color="#fff"
                      fontSize={14}
                    >
                      Previous Step
                    </Button>
                  )}
                  <Button
                    fontWeight="bold"
                    backgroundColor={neonBlue[400]}
                    color="#fff"
                    fontSize={14}
                    disabled={!itemChecked}
                    disabledStyle={{
                      backgroundColor: neutral[200],
                    }}
                    onPress={() => {
                      if (user) {
                        dispatch(pickedCurrentItem(user._id));
                        setItemChecked(false);
                      }
                    }}
                  >
                    Next Step
                  </Button>
                </XStack>
              ) : (
                <Button
                  fontWeight="bold"
                  backgroundColor={neonBlue[400]}
                  color="#fff"
                  fontSize={14}
                  mt={24}
                  alignSelf="center"
                  width={100}
                  onPress={async () => {
                    if (user) {
                      await dispatch(completeCurrentBatch(user._id));
                      setIsFinished(true);
                    }
                  }}
                >
                  Finish
                </Button>
              )}
            </YStack>
          </Card>
        )}
        {isFinished && (
          <YStack gap={24} alignItems="center" mt={64} px={24}>
            <FontAwesome size={64} name="check-circle" color={green[600]} />
            <H5 textAlign="center" fontWeight={500}>
              You've finished your current batch! Take a rest before starting a
              new one.
            </H5>
          </YStack>
        )}
      </YStack>
      <Sheet
        modal
        open={openPicklistModal}
        onOpenChange={setOpenPicklistModal}
        snapPoints={[66]}
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
              <H4 fontWeight={600}>Picklist for Batch {batch?.shortId}</H4>
            </XStack>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <YGroup gap={16} separator={<Separator />} pb={80}>
                {batch?.itemToPickSequence.map((pickListItem, index) => (
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
                        <XStack gap={16} mr={8}>
                          <YStack alignItems="center">
                            <H4 fontWeight={400}>{pickListItem.quantity}</H4>
                            <H6 fontWeight={300}>Unit(s)</H6>
                          </YStack>
                          <FontAwesome
                            size={24}
                            name={
                              pickListItem.isPicked
                                ? "check-circle"
                                : "circle-o"
                            }
                            color={
                              pickListItem.isPicked ? green[600] : neutral[500]
                            }
                          />
                        </XStack>
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
