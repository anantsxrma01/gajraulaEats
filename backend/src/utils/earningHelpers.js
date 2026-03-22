const {
  DEFAULT_SHOP_COMMISSION_PERCENT,
  DEFAULT_DP_PER_ORDER_BASE,
  DEFAULT_DP_PER_KM
} = require("../config/financeConfig");

function calculateShopEarning({ subTotal, commissionPercent }) {
  const percent = commissionPercent ?? DEFAULT_SHOP_COMMISSION_PERCENT;
  const commission = (subTotal * percent) / 100;
  const net = subTotal - commission;

  return {
    commissionPercent: percent,
    commissionAmount: Number(commission.toFixed(2)),
    netPayable: Number(net.toFixed(2))
  };
}

function calculatePartnerEarning({ distanceKm }) {
  const base = DEFAULT_DP_PER_ORDER_BASE;
  const variable = distanceKm * DEFAULT_DP_PER_KM;
  const total = base + variable;

  return {
    baseAmount: Number(base.toFixed(2)),
    perKmRate: DEFAULT_DP_PER_KM,
    variableAmount: Number(variable.toFixed(2)),
    totalEarning: Number(total.toFixed(2))
  };
}

module.exports = {
  calculateShopEarning,
  calculatePartnerEarning
};
