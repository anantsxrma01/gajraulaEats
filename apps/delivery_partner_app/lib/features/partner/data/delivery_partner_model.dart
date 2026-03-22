class DeliveryPartnerModel {
  final String id;
  final String userId;
  final String vehicleType;
  final String status;
  final bool isOnline;
  final int totalTrips;

  DeliveryPartnerModel({
    required this.id,
    required this.userId,
    required this.vehicleType,
    required this.status,
    required this.isOnline,
    required this.totalTrips,
  });

  factory DeliveryPartnerModel.fromJson(Map<String, dynamic> json) {
    return DeliveryPartnerModel(
      id: json['_id']?.toString() ?? '',
      userId: json['user_id']?.toString() ?? '',
      vehicleType: json['vehicle_type'] ?? 'BIKE',
      status: json['status'] ?? 'PENDING',
      isOnline: json['is_online'] ?? false,
      totalTrips: json['total_trips'] ?? 0,
    );
  }
}
