import 'package:flutter/foundation.dart';

import '../data/delivery_order.dart';
import '../data/delivery_orders_api.dart';

class DeliveryOrdersProvider extends ChangeNotifier {
  final DeliveryOrdersApi api;

  DeliveryOrdersProvider(this.api);

  List<DeliveryOrder> _orders = [];
  bool _isLoading = false;
  String? _error;

  List<DeliveryOrder> get orders => _orders;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadOrders() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await api.getAssignedOrders();
      _orders = result;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  DeliveryOrder? findById(String id) {
    try {
      return _orders.firstWhere((o) => o.id == id);
    } catch (_) {
      return null;
    }
  }

  Future<void> markPicked(String orderId) async {
    try {
      final updated = await api.markPicked(orderId);
      final index = _orders.indexWhere((o) => o.id == orderId);
      if (index != -1) {
        _orders[index] = updated;
      }
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> markDelivered(String orderId) async {
    try {
      final updated = await api.markDelivered(orderId);
      final index = _orders.indexWhere((o) => o.id == orderId);
      if (index != -1) {
        _orders[index] = updated;
      } else {
        // delivered orders might be removed from list; up to you
        _orders.add(updated);
      }
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }
}
