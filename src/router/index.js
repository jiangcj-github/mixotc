import Vue from "vue";
import Router from "vue-router";
import Transaction from "@/views/transaction/Transaction";
import BuyPage from "@/views/transaction/BuyPage";
import SellPage from "@/views/transaction/SellPage";
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
      path: "/transaction/buyPage",
      name: "buyPage",
      component: BuyPage
    },
    {
      path: "/transaction/sellPage",
      name: "sellPage",
      component: SellPage
    },
    {
      path: "/transaction/tradeRules",
      name: "tradeRules",
      component: TradeRules
    }
  ]
});
