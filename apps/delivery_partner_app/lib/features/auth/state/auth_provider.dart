import 'package:flutter/foundation.dart';
import '../data/auth_repository.dart';
import '../data/user_model.dart';
import '../../partner/data/delivery_partner_model.dart';

enum AuthStatus {
  initial,
  sendingOtp,
  otpSent,
  verifyingOtp,
  authenticated,
  error,
}

class AuthProvider extends ChangeNotifier {
  final AuthRepository _repo;

  AuthProvider(this._repo);

  AuthStatus _status = AuthStatus.initial;
  AuthStatus get status => _status;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  AppUser? _user;
  AppUser? get user => _user;

  DeliveryPartnerModel? _partner;
  DeliveryPartnerModel? get partner => _partner;

  bool get isDeliveryPartner => _user?.role == 'DELIVERY_PARTNER';

  void _setStatus(AuthStatus status) {
    _status = status;
    notifyListeners();
  }

  void _setError(String msg) {
    _errorMessage = msg;
    _status = AuthStatus.error;
    notifyListeners();
  }

  Future<void> sendOtp(String phone) async {
    try {
      _setStatus(AuthStatus.sendingOtp);
      await _repo.sendOtp(phone);
      _setStatus(AuthStatus.otpSent);
    } catch (e) {
      _setError(e.toString());
    }
  }

  Future<void> verifyOtp(String phone, String otp) async {
    try {
      _setStatus(AuthStatus.verifyingOtp);
      final result = await _repo.verifyOtp(phone, otp);
      _user = result['user'] as AppUser;
      _status = AuthStatus.authenticated;
      notifyListeners();
      // partner profile lazily load कर सकते हैं
      await loadPartnerProfile();
    } catch (e) {
      _setError(e.toString());
    }
  }

  Future<void> loadPartnerProfile() async {
    try {
      final p = await _repo.fetchMyDeliveryPartnerProfile();
      _partner = p;
      notifyListeners();
    } catch (e) {
      // ignore for now
    }
  }

  Future<void> registerAsDeliveryPartner(String vehicleType) async {
    try {
      final p = await _repo.registerDeliveryPartner(vehicleType);
      _partner = p;
      // role बदल जाएगा backend पे, लेकिन हमारे पास अभी पुरानी user.role है
      // UI level पर हम partner != null को मान सकते हैं कि DP है
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    }
  }

  Future<void> logout() async {
    await _repo.logout();
    _user = null;
    _partner = null;
    _status = AuthStatus.initial;
    notifyListeners();
  }
}
