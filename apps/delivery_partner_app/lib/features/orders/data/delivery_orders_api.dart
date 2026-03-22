import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../../core/network/api_client.dart';
import 'delivery_order.dart';

class DeliveryOrdersApi {
  final ApiClient apiClient;

  DeliveryOrdersApi(this.apiClient);

  Future<List<DeliveryOrder>> getAssignedOrders() async {
    final http.Response res =
        await apiClient.get('/api/delivery-partner/orders');

    if (res.statusCode != 200) {
      throw Exception('Failed to load orders');
    }

    final data = jsonDecode(res.body);
    final List list = data['orders'] ?? [];

    return list.map((e) => DeliveryOrder.fromJson(e)).toList();
  }

  Future<DeliveryOrder> markPicked(String orderId) async {
    final res = await apiClient.patch(
      '/api/delivery-partner/orders/$orderId/pick',
    );

    if (res.statusCode != 200) {
      throw Exception('Failed to mark picked');
    }

    final data = jsonDecode(res.body);
    return DeliveryOrder.fromJson(data['order']);
  }

  Future<DeliveryOrder> markDelivered(String orderId) async {
    final res = await apiClient.patch(
      '/api/delivery-partner/orders/$orderId/deliver',
    );

    if (res.statusCode != 200) {
      throw Exception('Failed to mark delivered');
    }

    final data = jsonDecode(res.body);
    return DeliveryOrder.fromJson(data['order']);
  }
}
