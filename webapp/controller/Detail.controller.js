sap.ui.define([
  "bs/ui5/projeto/controller/BaseController",
  "sap/ui/core/routing/History"
], function (BaseController, History) {
  "use strict";

  return BaseController.extend("bs.ui5.projeto.controller.Detail", {

    onInit: function () {
      // Liga o handler à rota "detail" (routing definido no manifest.json)
      this.getRouter().getRoute("detail").attachPatternMatched(this._onMatched, this);
    },

    _onMatched: function (oEvent) {
      // Lê os argumentos da rota e faz element binding à entidade específica
      var oArgs = oEvent.getParameter("arguments");
      var sPath = "/Disciplinas/" + oArgs.discIndex + "/recursos/" + oArgs.resIndex;
      this.getView().bindElement({ path: sPath });
    },

    onNavBack: function () {
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        // Volta para "home" e substitui a hash (para não duplicar histórico)
        this.getRouter().navTo("home", {}, true);
      }
    }

  });
});