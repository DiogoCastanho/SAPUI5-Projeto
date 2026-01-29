sap.ui.define([], function () {
  "use strict";

  return {
    iconByType: function (sTipo) {
      switch ((sTipo || "").toLowerCase()) {
        case "livro": return "sap-icon://course-book";
        case "vídeo":
        case "video": return "sap-icon://video";
        case "artigo": return "sap-icon://document-text";
        case "pdf": return "sap-icon://pdf-attachment";
        case "e-book": return "sap-icon://e-learning";
        case "curso": return "sap-icon://study-leave";
        case "infográfico": return "sap-icon://Chart-Tree-Map";
        case "documentação": return "sap-icon://document";
        case "imagem": return "sap-icon://photo-voltaic";
        default: return "sap-icon://document";
      }
    },

    stateByObrigatorio: function (bObrig) {
      return bObrig ? "None" : "Success";
    },

    textObrigatorio: function (bObrig) {
      return bObrig ? "Consulta Obrigatória" : "Consulta Facultativa";
    },

    countResources: function (aRecursos) {
      return Array.isArray(aRecursos) ? aRecursos.length : 0;
    },

    boldText: function (sText) {
      if (!sText) return "";
      return "<b>" + sText + "</b>";
    },

    formatResourceCount: function (aRecursos, sPlural, sSingular) {
      var iCount = Array.isArray(aRecursos) ? aRecursos.length : 0;
      var sText = iCount === 1 ? sSingular : sPlural;
      return iCount + " " + sText;
    },

    formatDescription: function (sDescricao) {
      if (!sDescricao || sDescricao.trim() === "") {
        return "Sem descrição disponível";
      }
      return sDescricao;
    },

    hasValidUrl: function (sUrl) {
      return !!(sUrl && sUrl.trim());
    }
  };
});
