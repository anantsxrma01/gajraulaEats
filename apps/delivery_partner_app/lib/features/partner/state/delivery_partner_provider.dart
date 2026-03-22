import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import '../../../core/config/env.dart';
import '../../../core/network/api_client.dart';
import '../../../core/services/location_service.dart';

class DeliveryPartnerProvider extends ChangeNotifier {
  final ApiClient _api = ApiClient(baseUrl: Env.apiBaseUrl);

  bool _isOnline = false;
  bool get isOnline => _isOnline;

  bool _isUpdatingStatus = false;
  bool get isUpdatingStatus => _isUpdatingStatus;

  String? _error;
  String? get error => _error;

  double? _lastLat;
  double? _lastLng;

  double? get lastLat => _lastLat;
  double? get lastLng => _lastLng;

  Timer? _locationTimer;

  // कितने सेकंड में एक बार location backend को भेजनी है
  final Duration _locationInterval = const Duration(seconds: 45);

  // Init में अगर ज़रूरत हो तो backend से current state लाने की logic बाद में जोड़ सकते हो

  Future<void> toggleOnline(bool value) async {
    _error = null;
    _isUpdatingStatus = true;
    notifyListeners();

    try {
      double? lat;
      double? lng;

      if (value == true) {
        // Going online → get current location first
        final position = await LocationService.getCurrentPosition();
        if (position == null) {
          _error = "Location permission/GPS required.";
          _isUpdatingStatus = false;
          notifyListeners();
          return;
        }
        lat = position.latitude;
        lng = position.longitude;
        _lastLat = lat;
        _lastLng = lng;
      }

      final body = <String, dynamic>{
        'is_online': value,
      };
      if (lat != null && lng != null) {
        body['lat'] = lat;
        body['lng'] = lng;
      }

      final http.Response res =
          await _api.patch('/api/delivery-partner/status', body: body);

      if (res.statusCode >= 200 && res.statusCode < 300) {
        // success
        _isOnline = value;

        if (_isOnline) {
          _startLocationTimer();
        } else {
          _stopLocationTimer();
        }
      } else {
        _error = 'Failed to update status: ${res.statusCode}';
      }
    } catch (e) {
      _error = 'Error: $e';
    }

    _isUpdatingStatus = false;
    notifyListeners();
  }

  void _startLocationTimer() {
    _locationTimer?.cancel();
    _locationTimer = Timer.periodic(_locationInterval, (_) {
      if (_isOnline) {
        _sendLocationUpdate();
      }
    });
  }

  void _stopLocationTimer() {
    _locationTimer?.cancel();
    _locationTimer = null;
  }

  Future<void> _sendLocationUpdate() async {
    try {
      final position = await LocationService.getCurrentPosition();
      if (position == null) return;

      _lastLat = position.latitude;
      _lastLng = position.longitude;

      await _api.post('/api/delivery-partner/location', body: {
        'lat': _lastLat,
        'lng': _lastLng,
      });

      // यहाँ error check कर सकते हैं, लेकिन अभी silent रख रहे हैं
      notifyListeners();
    } catch (e) {
      // optionally log/ignore
    }
  }

  @override
  void dispose() {
    _stopLocationTimer();
    super.dispose();
  }
}
