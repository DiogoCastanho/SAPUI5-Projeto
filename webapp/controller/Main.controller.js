sap.ui.define([
  "bs/ui5/projeto/controller/BaseController",
  "sap/ui/core/Fragment",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (BaseController, Fragment, Filter, FilterOperator, Sorter, MessageToast, MessageBox) {
  "use strict";

  return BaseController.extend("bs.ui5.projeto.controller.Main", {

    /* ============================
     * Ciclo de vida / Inicialização
     * ============================ */
    onInit: function () {
      // Busy enquanto o modelo JSON (manifest) carrega
      var oView = this.getView();
      oView.setBusyIndicatorDelay(0);
      oView.setBusy(true);

      var oModel = oView.getModel();
      if (oModel && oModel.attachRequestCompleted) {
        oModel.attachRequestCompleted(function () {
          oView.setBusy(false);
        });
      } else {
        // Fallback: retirar busy no próximo tick (caso já esteja carregado)
        setTimeout(function () { oView.setBusy(false); }, 0);
      }
    },

    /* ============================
     * Fragmento "Sobre"
     * ============================ */
    onOpenAbout: function () {
      var that = this;
      if (!this._oAbout) {
        Fragment.load({
          id: this.getView().getId(),
          name: "bs.ui5.projeto.view.fragment.AboutDialog",
          controller: this
        }).then(function (oDialog) {
          that._oAbout = oDialog;
          that.getView().addDependent(that._oAbout);
          that._oAbout.open();
        }).catch(function (err) {
          MessageBox.error("Falha a carregar o diálogo 'Sobre'.\n\n" + err);
        });
      } else {
        this._oAbout.open();
      }
    },

    onCloseAbout: function () {
      if (this._oAbout) {
        this._oAbout.close();
      }
    },

    /* ============================
     * Pesquisa (filtro por título)
     * ============================ */
    _applyFilterToAllResourceLists: function (sQuery) {
      var oDiscList = this.byId("disciplinesList");
      var aItems = oDiscList.getItems();
      var aFilters = [];
      if (sQuery) {
        aFilters.push(new Filter({
          path: "titulo",
          operator: FilterOperator.Contains,
          value1: sQuery,
          caseSensitive: false
        }));
      }
      aItems.forEach(function (oCustomItem) {
        var oPanel = oCustomItem.getContent()[0];
        var oInnerList = oPanel.getContent()[0];
        var oBinding = oInnerList.getBinding("items");
        if (oBinding) {
          oBinding.filter(aFilters, "Application");
        }
      });
    },

    onSearch: function (oEvent) {
      var sQuery = oEvent.getSource().getValue();
      this._applyFilterToAllResourceLists(sQuery);
    },

    /* ============================
     * Navegação Master → Detail
     * ============================ */
    onItemPress: function (oEvent) {
      var sPath = oEvent.getSource().getBindingContext().getPath();
      // Esperado: /Disciplinas/{i}/recursos/{j}
      var m = sPath.match(/\/Disciplinas\/(\d+)\/recursos\/(\d+)/);
      if (m) {
        this.getRouter().navTo("detail", { discIndex: m[1], resIndex: m[2] });
      }
    },

    /* ============================
     * Ordenação (Extra)
     * ============================ */
    onSortChange: function (oEvent) {
      var sKey = oEvent.getSource().getSelectedKey(); // "typeAsc" | "typeDesc" | "discAsc" | "discDesc"
      if (sKey === "discAsc" || sKey === "discDesc") {
        this._sortDisciplines(sKey === "discDesc");
      } else {
        this._sortAllResourceListsByType(sKey === "typeDesc");
      }
    },

    _sortDisciplines: function (bDescending) {
      var oDiscList = this.byId("disciplinesList");
      var oBinding = oDiscList.getBinding("items");
      if (oBinding) {
        oBinding.sort([ new Sorter("nome", bDescending) ]);
      }
    },

    _sortAllResourceListsByType: function (bDescending) {
      var oDiscList = this.byId("disciplinesList");
      oDiscList.getItems().forEach(function (oCustomItem) {
        var oPanel = oCustomItem.getContent()[0];
        var oInnerList = oPanel.getContent()[0];
        var oBinding = oInnerList.getBinding("items");
        if (oBinding) {
          oBinding.sort([ new Sorter("tipo", bDescending) ]);
        }
      });
    },

    /* ============================
     * Adicionar Recurso (Extra)
     * ============================ */
    onAddResource: function () {
      var that = this;
      Fragment.load({
        id: this.getView().getId(),
        name: "bs.ui5.projeto.view.fragment.AddResource",
        controller: this
      }).then(function (oDialog) {
        that._oAdd = oDialog;
        that.getView().addDependent(that._oAdd);
        that._resetAddForm();
        that._oAdd.open();
      }).catch(function (err) {
        MessageBox.error("Falha a carregar o diálogo 'Adicionar Recurso'.\n\n" + err);
      });
    },

    onCancelAddResource: function () {
      if (this._oAdd) {
        this._oAdd.close();
      }
    },

    onSaveResource: function () {
      var oV = this.getView();

      // Controles do fragmento (instanciado com id da View → usar view.byId)
      var oSelDisc  = oV.byId("selDisc");
      var oInpTitle = oV.byId("inpTitle");
      var oSelType  = oV.byId("selType");
      var oSwMand   = oV.byId("swMand");
      var oTaDesc   = oV.byId("taDesc");
      var oInpUrl   = oV.byId("inpUrl");

      // 1) Determinar a disciplina pelo BindingContext do item selecionado
      var oSelItem = oSelDisc && oSelDisc.getSelectedItem();
      if (!oSelItem) { MessageToast.show("Seleciona uma disciplina"); return; }
      var oCtx = oSelItem.getBindingContext(); // contexto relativo a "/Disciplinas"
      if (!oCtx) { MessageToast.show("Disciplina inválida"); return; }

      // path do objeto disciplina, ex.: "/Disciplinas/0"
      var sDiscPath = oCtx.getPath();

      // 2) Construir o novo recurso
      var oNew = {
        titulo:      oInpTitle ? oInpTitle.getValue() : "",
        tipo:        oSelType ? oSelType.getSelectedKey() : "",
        obrigatorio: oSwMand ? !!oSwMand.getState() : false,
        descricao:   oTaDesc ? oTaDesc.getValue() : "",
        url:         oInpUrl ? oInpUrl.getValue() : ""
      };

      // 3) Validações mínimas
      if (!oNew.titulo) { MessageToast.show("Preenche o título"); return; }
      if (!oNew.tipo)   { MessageToast.show("Seleciona o tipo"); return; }

      // 4) Inserir no array de recursos dessa disciplina
      var oModel = oV.getModel();
      var aRec = oModel.getProperty(sDiscPath + "/recursos") || [];
      aRec.push(oNew);

      // Commit das alterações (setProperty garante atualização dos bindings)
      oModel.setProperty(sDiscPath + "/recursos", aRec);

      // Fechar e limpar
      if (this._oAdd) { this._oAdd.close(); }
      MessageToast.show("Recurso adicionado");
    },

    // Utilitário para limpar o formulário do diálogo
    _resetAddForm: function () {
      var oV = this.getView();
      var oSelDisc  = oV.byId("selDisc");
      var oInpTitle = oV.byId("inpTitle");
      var oSelType  = oV.byId("selType");
      var oSwMand   = oV.byId("swMand");
      var oTaDesc   = oV.byId("taDesc");
      var oInpUrl   = oV.byId("inpUrl");

      if (oSelDisc && oSelDisc.getFirstItem()) { oSelDisc.setSelectedItem(oSelDisc.getFirstItem()); }
      if (oInpTitle) { oInpTitle.setValue(""); }
      if (oSelType && oSelType.getFirstItem()) { oSelType.setSelectedItem(oSelType.getFirstItem()); }
      if (oSwMand)   { oSwMand.setState(false); }
      if (oTaDesc)   { oTaDesc.setValue(""); }
      if (oInpUrl)   { oInpUrl.setValue(""); }
    }

  });
});