class DeliveryOrder {
  final String id;
  final String orderNumber;
  final String status;
  final String paymentMode;
  final String paymentStatus;
  final double subTotal;
  final double deliveryCharge;
  final double totalAmount;
  final String shopName;
  final String shopAddress;
  final String dropAddress;
  final DateTime createdAt;

  DeliveryOrder({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.paymentMode,
    required this.paymentStatus,
    required this.subTotal,
    required this.deliveryCharge,
    required this.totalAmount,
    required this.shopName,
    required this.shopAddress,
    required this.dropAddress,
    required this.createdAt,
  });

  factory DeliveryOrder.fromJson(Map<String, dynamic> json) {
    final shop = json['shop_id'] ?? {};
    final addr = json['address_id'] ?? {};

    return DeliveryOrder(
      id: json['_id'] as String,
      orderNumber: (json['order_number'] ?? '') as String,
      status: (json['order_status'] ?? '') as String,
      paymentMode: (json['payment_mode'] ?? '') as String,
      paymentStatus: (json['payment_status'] ?? '') as String,
      subTotal: (json['sub_total'] ?? 0).toDouble(),
      deliveryCharge: (json['delivery_charge'] ?? 0).toDouble(),
      totalAmount: (json['total_amount'] ?? 0).toDouble(),
      shopName: (shop['name'] ?? '') as String,
      shopAddress: ((shop['address']?['line1'] ?? '') as String),
      dropAddress:
          "${addr['line1'] ?? ''}, ${addr['city'] ?? ''}", // adjust if more fields
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }
}
