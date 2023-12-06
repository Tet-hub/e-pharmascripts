import {
  View,
  Text,
  StyleSheet,
  Switch,
  Dimensions,
  Image,
  Button,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from "./stylesheet";
import React, { useState, useEffect } from "react";

const formatDate = (timestamp) => {
  const date = timestamp.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return date;
};

const CancelledOrderList = ({
  trackerTab,
  loading,
  orderData,
  filteredProductData,
  handleViewCancelledOrders,
  refreshing,
  onRefresh,
}) => {
  return (
    trackerTab === 4 && (
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#EC6F56" />
          </View>
        ) : orderData.length === 0 ? (
          <View style={styles.noOrdersCont}>
            <View style={styles.noOrders}>
              <Iconify
                icon="fluent-mdl2:deactivate-orders"
                size={50}
                color="black"
                style={styles.noOrdersIcon}
              />
              <Text>No Orders Yet</Text>
            </View>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={orderData}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                scrollEnabled={false}
              />
            }
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              if (item.status === "Cancelled") {
                return (
                  <View key={item.id} style={styles.orderGroupContainer}>
                    <View style={styles.sellerCont}>
                      <Iconify
                        icon="healthicons:market-stall-outline"
                        size={23}
                        color="black"
                      />
                      <Text style={styles.groupTitle}>
                        {item.branchName ? item.branchName : "Seller"}
                      </Text>
                      <View style={styles.rightContainer}>
                        <Text style={styles.groupTitleRight}>
                          {item.createdAt
                            ? formatDate(item.createdAt.toDate())
                            : ""}
                        </Text>
                      </View>
                    </View>
                    {filteredProductData.map((orders, index) => (
                      <View key={index}>
                        {orders.map((order, orderIndex) => {
                          if (order.orderId === item.id && orderIndex === 0) {
                            return (
                              <View key={order.id}>
                                <View style={styles.productContainer}>
                                  <View style={styles.productDataContainer}>
                                    <View style={styles.imageContainer}>
                                      <Image
                                        source={{
                                          uri: order.productImg || "",
                                        }}
                                        style={styles.productImage}
                                      />
                                    </View>
                                    <View style={styles.productInfoContainer}>
                                      <View style={styles.productNamePrescCont}>
                                        <View>
                                          <Text
                                            style={styles.productName}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                          >
                                            {order.productName || ""}
                                          </Text>
                                        </View>
                                        <View>
                                          {order.prescription === "Yes" ? (
                                            <Text style={styles.productReq}>
                                              [ Requires Prescription ]
                                            </Text>
                                          ) : (
                                            <Text
                                              style={styles.productReq}
                                            ></Text>
                                          )}
                                        </View>
                                      </View>
                                      <View style={styles.priceRowContainer}>
                                        <View style={styles.quantityCont}>
                                          <Text style={styles.productAmount}>
                                            x{order.quantity || ""}
                                          </Text>
                                        </View>

                                        <Text style={styles.productPrice}>
                                          {"\u20B1"}
                                          {order.price || ""}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                  <View style={styles.separator} />
                                  <View style={styles.viewOrderDetails}>
                                    <View>
                                      <Text>Items: {item.totalQuantity}</Text>
                                    </View>
                                    <View style={styles.orderTotalCont}>
                                      <Text style={styles.orderTotalText}>
                                        Order Total:
                                      </Text>
                                      <Text style={styles.productPrice}>
                                        {" \u20B1"} {item.totalPrice}
                                      </Text>
                                    </View>
                                  </View>
                                  <View style={styles.separator2} />
                                  <View style={styles.viewButtonCont}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleViewCancelledOrders(item.id)
                                      }
                                      style={styles.viewButton}
                                    >
                                      <Text style={styles.viewText}>
                                        VIEW DETAILS
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </View>
                    ))}
                  </View>
                );
              } else {
                return null;
              }
            }}
          />
        )}
      </View>
    )
  );
};

export default CancelledOrderList;
