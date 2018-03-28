import Vue from "vue";
import Router from "vue-router";
import Transaction from "@/views/transaction/Transaction";
import Order from "@/views/transaction/Order";
import TradeRules from "@/views/transaction/tradeRules";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: Transaction
    },
    {
      path: "/transaction",
      name: "transaction",
      component: Transaction
    },
    {
      path: "/transaction/order",
      name: "order",
      component: Order
    },
    {
      path: "/transaction/tradeRules",
      name: "tradeRules",
      component: TradeRules
    }
  ]
});
