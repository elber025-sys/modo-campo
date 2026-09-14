/**
 * MAPA DE DEMANDAS OPERACIONAIS - V5.7
 * 1º GP / 5º Pel MAmb
 *
 * Principais mudanças:
 * 1) O mapa envia somente demandas ainda não atendidas.
 * 2) O marcador permite responder diretamente a planilha Google de origem.
 * 3) O marcador permite abrir o PDF/pasta da demanda quando houver link.
 *
 * IMPORTANTE:
 * - Este projeto deve continuar vinculado à planilha central do mapa.
 * - As planilhas de origem permanecem separadas no Google Drive.
 * - A localização dos registros é feita por identificador e, quando necessário,
 *   por uma comparação conservadora de data/município/natureza.
 */

const NOME_ABA_MAPA = 'DEMANDAS';

const FONTES = {
  DDU: {
    spreadsheetId: '1oHZ9WHmRCIDEI1hK9C_hORrT9dwn5RfVU5HaaQ4V2RU',
    sheetId: 31601444,
    prazoDias: 85,
    recebimentoHeaders: ['DATA ENVIO À FRAÇÃO', 'DATA ENVIO A FRAÇÃO', 'DATA ENVIO À FRACAO', 'DATA ENVIO A FRACAO'],
    chaveHeaders: ['CÓDIGO DEMANDA'],
    pdfHeaders: ['LINK PDF', 'LINK DO PDF'],
    dataHeaders: ['DATA GERADA'],
    municipioHeaders: ['MUNICÍPIO', 'MUNICIPIO'],
    naturezaHeaders: ['NATUREZA DA INFRAÇÃO', 'NATUREZA'],
    camposResposta: [
      { id: 'dataAtendimento', label: 'Data do atendimento', headers: ['DATA ATENDIMENTO'], tipo: 'date', obrigatorio: true },
      { id: 'gaia', label: 'Número do GAIA', headers: ['NÚMERO DO GAIA', 'NUMERO DO GAIA', 'GAIA'], tipo: 'gaia' },
      { id: 'reds', label: 'Número do REDS', headers: ['NÚMERO DO REDS', 'NUMERO DO REDS', 'REDS'] },
      {
        id: 'resultado',
        label: 'Resultado',
        headers: ['RESULTADO'],
        tipo: 'select',
        opcoes: [
          'CONSTATADO',
          'NÃO CONSTATADO',
          'ORIENTAÇÃO VERBAL',
          'NÃO LOCALIZADO',
          'ENTRADA NÃO AUTORIZADA',
          'DUAS TENTATIVAS',
          'NINGUÉM NO LOCAL (UMA VEZ)',
          'PC/SEMMA'
        ]
      }
    ]
  },

  NUDEN: {
    spreadsheetId: '1MUIKzQeA2zqWyxuhpAQTlTuFFHnMUtjIlu4vNAGkGuk',
    sheetId: 1585383872,
    prazoDias: 85,
    recebimentoHeaders: ['DATA ENVIO À FRAÇÃO', 'DATA ENVIO A FRAÇÃO', 'DATA ENVIO À FRACAO', 'DATA ENVIO A FRACAO'],
    chaveHeaders: ['CÓDIGO DEMANDA'],
    pdfHeaders: ['LINK DO PDF', 'LINK PDF'],
    dataHeaders: ['DATA GERADA'],
    municipioHeaders: ['MUNICÍPIO', 'MUNICIPIO'],
    naturezaHeaders: ['NATUREZA DA INFRAÇÃO', 'NATUREZA'],
    removerPrefixosCodigo: ['D'],
    camposResposta: [
      { id: 'dataAtendimento', label: 'Data do atendimento', headers: ['DATA ATENDIMENTO'], tipo: 'date', obrigatorio: true },
      { id: 'gaia', label: 'Número do GAIA', headers: ['NÚMERO DO GAIA', 'NUMERO DO GAIA', 'GAIA'], tipo: 'gaia' },
      { id: 'reds', label: 'Número do REDS', headers: ['NÚMERO DO REDS', 'NUMERO DO REDS', 'REDS'] }
    ]
  },

  REQUISICOES: {
    spreadsheetId: '1xPVElmfVWF-DUzVwnZKU_rPKECkoycMJgrFrfOwODaM',
    sheetId: 329199359,
    prazoDias: 15,
    recebimentoHeaders: ['DATA DE ENTRADA', 'DATA ENTRADA'],
    chaveHeaders: ['Nº DO OFÍCIO', 'N° DO OFÍCIO', 'N DO OFICIO', 'Nº DO OFICIO'],
    pdfHeaders: ['LINK PDF', 'LINK DO PDF', 'LINK PASTA'],
    dataHeaders: ['DATA DE ENTRADA'],
    municipioHeaders: ['MUNICÍPIO', 'MUNICIPIO'],
    naturezaHeaders: ['NATUREZA DA FISCALIZAÇÃO', 'NATUREZA DA FISCALIZACAO'],
    removerPrefixosCodigo: ['R', 'REQ'],
    camposResposta: [
      { id: 'dataAtendimento', label: 'Data do atendimento', headers: ['DATA DO ATENDIMENTO', 'DATA DE ATENDIMENTO'], tipo: 'date', obrigatorio: true },
      { id: 'reds', label: 'REDS', headers: ['REDS'] },
      { id: 'gaia', label: 'GAIA (se constatado)', headers: ['GAIA (Se Constatado)', 'GAIA\n(Se Constatado)', 'GAIA'], tipo: 'gaia' },
      { id: 'obs', label: 'Observações', headers: ['OBS', 'OBSERVAÇÃO', 'OBSERVACOES'], tipo: 'textarea' }
    ]
  },

  MONITORAMENTO: {
    spreadsheetId: '1SKNnPWtNLJlYdG45xOC99azdjhzblaTAaCnHaGCPfQ4',
    sheetId: 498242098,
    prazoDias: 20,
    recebimentoHeaders: ['DATA DE ENVIO', 'DATA ENVIO'],
    // Confirmado: CÓDIGO DEMANDA da planilha central corresponde a GEOCOD_IEF.
    chaveHeaders: ['GEOCOD_IEF'],
    pdfHeaders: ['LINK PDF', 'LINK DO PDF', 'LINK PASTA'],
    dataHeaders: ['DATA_INIC', 'DATA INIC', 'DATA DE ENVIO'],
    municipioHeaders: ['MUNICIPIO', 'MUNICÍPIO'],
    naturezaHeaders: [],
    camposResposta: [
      { id: 'dataAtendimento', label: 'Data do atendimento', headers: ['Data atendimento', 'DATA ATENDIMENTO'], tipo: 'date', obrigatorio: true },
      { id: 'gaia', label: 'GAIA', headers: ['GAIA'], tipo: 'gaia' },
      { id: 'reds', label: 'REDS', headers: ['REDS'] }
    ],
    statusAutomatico: { headers: ['STATUS'], valor: 'ATENDIDA' }
  },

  NEA: {
    spreadsheetId: '1V9Ow6r1lCqZQN3821qEtukVsBQJhQCwlTbC0C1EWKAc',
    sheetId: 1670883856,
    prazoDias: 10,
    recebimentoHeaders: ['DATA'],
    chaveHeaders: ['Nº PROTOC.', 'N° PROTOC.', 'N PROTOC.', 'PROTOCOLO'],
    pdfHeaders: ['LINK PDF', 'LINK DO PDF', 'LINK PASTA'],
    dataHeaders: ['DATA'],
    municipioHeaders: ['MUNICÍPIO', 'MUNICIPIO'],
    naturezaHeaders: ['MODALIDADE DO ACIDENTE'],
    removerPrefixosCodigo: ['N', 'NEA'],
    camposResposta: [
      { id: 'dataAtendimento', label: 'Data do atendimento', headers: ['DATA DO ATENDIMENTO', 'DATA DE ATENDIMENTO'], tipo: 'date', obrigatorio: true },
      { id: 'reds', label: 'REDS', headers: ['REDS'] },
      { id: 'gaia', label: 'GAIA', headers: ['GAIA'], tipo: 'gaia' }
    ]
  },

  PREVINCENDIO: {
    spreadsheetId: '1lli_FKpEXkYliXinOTFYk3yhOQvi6i44UdTHU3MazTU',
    sheetId: 619460725,
    prazoDias: 10,
    recebimentoHeaders: ['DATA DE RECEBIMENTO', 'DATA RECEBIMENTO'],
    chaveHeaders: ['RI'],
    pdfHeaders: ['LINK PDF', 'LINK DO PDF', 'LINK PASTA'],
    dataHeaders: ['DATA DE RECEBIMENTO'],
    municipioHeaders: ['MUNICÍCIPIO', 'MUNICÍPIO', 'MUNICIPIO'],
    naturezaHeaders: ['TIPO'],
    removerPrefixosCodigo: ['P', 'RI'],
    camposResposta: [
      { id: 'dataAtendimento', label: 'Data do atendimento', headers: ['DATA DE ATENDIMENTO', 'DATA DO ATENDIMENTO'], tipo: 'date', obrigatorio: true },
      { id: 'reds', label: 'REDS', headers: ['REDS'] },
      { id: 'gaia', label: 'GAIA', headers: ['GAIA'], tipo: 'gaia' }
    ],
    statusAutomatico: { headers: ['STATUS'], valor: 'ATENDIDA' }
  },

  BALCAO: {
    spreadsheetId: '1qTksUnOKiOMo15wZf_XVNqTGzP7eNboJD8TVByHLeO4',
    sheetId: 228700619,
    prazoDias: 85,
    recebimentoHeaders: ['DATA RECEBIMENTO', 'DATA DE RECEBIMENTO'],
    chaveHeaders: ['Nº DENÚNCIA', 'N° DENÚNCIA', 'Nº DENUNCIA', 'N DENUNCIA'],
    pdfHeaders: ['LINK PASTA', 'LINK PDF', 'LINK DO PDF'],
    dataHeaders: ['DATA RECEBIMENTO'],
    municipioHeaders: ['MUNICÍPIO', 'MUNICIPIO'],
    naturezaHeaders: ['NATUREZA'],
    removerPrefixosCodigo: ['B'],
    camposResposta: [
      { id: 'dataAtendimento', label: 'Data do atendimento', headers: ['DATA ATENDIMENTO', 'DATA DE ATENDIMENTO'], tipo: 'date', obrigatorio: true },
      { id: 'reds', label: 'Nº REDS / BOS', headers: ['Nº REDS / BOS', 'N° REDS / BOS', 'REDS'] },
      { id: 'nat', label: 'Natureza (NAT)', headers: ['NAT'] },
      { id: 'autoInfracao', label: 'Auto de infração', headers: ['AUTO DE INFRAÇÃO', 'AUTO DE INFRACAO'] },
      { id: 'gaia', label: 'GAIA', headers: ['GAIA'], tipo: 'gaia' }
    ],
    statusAutomatico: { headers: ['STATUS'], valor: 'ATENDIDA' }
  }
};

function doGet(e) {
  // V7.0.7 — endpoints do Modo Campo. Mantém o mapa normal quando não há API.
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    if (p.api === 'modoCampoPacote') return _mcResponderPacoteV707_(p);
    if (p.api === 'modoCampoPdf') return _mcResponderPdfV707_(p);
  } catch (apiErr) {
    return _mcJsonpV707_((e && e.parameter && e.parameter.callback) || 'callback', {
      ok:false,
      mensagem:'Falha na API do Modo Campo: ' + String(apiErr && apiErr.message ? apiErr.message : apiErr)
    });
  }

  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Demandas Operacionais - 1º GP/5º Pel MAmb')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* =====================================================================
 * V7.0.7 — PONTE ROBUSTA MAPA ONLINE -> MODO CAMPO
 * Armazena temporariamente o pacote em partes no CacheService e entrega
 * ao PWA por JSONP. Evita depender de outro arquivo .gs do projeto.
 * ===================================================================== */
var MC_V707_PWA_URL = 'https://elber025-sys.github.io/modo-campo/PWA_Modo_Campo_V1/';
var MC_V707_TTL = 21600; // 6 horas
var MC_V707_CHUNK = 45000; // margem segura abaixo do limite por item do cache

function _mcCodigoV707_() {
  return Utilities.getUuid().replace(/-/g,'').slice(0,18).toUpperCase();
}

function _mcChaveV707_() {
  return Utilities.getUuid().replace(/-/g,'') + Utilities.getUuid().replace(/-/g,'').slice(0,8);
}

function _mcMetaKeyV707_(codigo) { return 'MC707_META_' + String(codigo || ''); }
function _mcParteKeyV707_(codigo, i) { return 'MC707_' + String(codigo || '') + '_' + Number(i); }

function _mcSalvarV707_(codigo, chave, txt) {
  txt = String(txt || '');
  var cache = CacheService.getScriptCache();
  var partes = Math.max(1, Math.ceil(txt.length / MC_V707_CHUNK));
  var meta = {
    chave: String(chave || ''),
    partes: partes,
    tamanho: txt.length,
    criadoEm: new Date().toISOString()
  };
  cache.put(_mcMetaKeyV707_(codigo), JSON.stringify(meta), MC_V707_TTL);
  for (var i = 0; i < partes; i++) {
    cache.put(_mcParteKeyV707_(codigo, i), txt.substring(i * MC_V707_CHUNK, (i + 1) * MC_V707_CHUNK), MC_V707_TTL);
  }
  return meta;
}

function _mcLerV707_(codigo, chave) {
  codigo = String(codigo || '').trim();
  chave = String(chave || '').trim();
  if (!codigo || !chave) throw new Error('Código/chave do pacote não informados.');
  var cache = CacheService.getScriptCache();
  var rawMeta = cache.get(_mcMetaKeyV707_(codigo));
  if (!rawMeta) throw new Error('Pacote expirado ou não encontrado. Reenvie pelo mapa online.');
  var meta = JSON.parse(rawMeta);
  if (String(meta.chave || '') !== chave) throw new Error('Chave do pacote inválida.');
  var partes = [];
  for (var i = 0; i < Number(meta.partes || 0); i++) {
    var p = cache.get(_mcParteKeyV707_(codigo, i));
    if (p === null) throw new Error('Pacote incompleto no cache. Reenvie pelo mapa online.');
    partes.push(p);
  }
  var txt = partes.join('');
  if (!txt) throw new Error('Pacote vazio.');
  return { meta: meta, texto: txt, pacote: JSON.parse(txt) };
}

function _mcCallbackSeguroV707_(cb) {
  cb = String(cb || 'callback');
  return /^[A-Za-z_$][A-Za-z0-9_$\.]{0,120}$/.test(cb) ? cb : 'callback';
}

function _mcJsonpV707_(callback, obj) {
  var cb = _mcCallbackSeguroV707_(callback);
  var js = cb + '(' + JSON.stringify(obj || {}) + ');';
  return ContentService.createTextOutput(js).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function criarPacoteModoCampoV707(payload) {
  try {
    payload = payload || {};
    var txt = String(payload.pacoteJson || '');
    if (!txt) return { ok:false, mensagem:'Pacote não informado.' };

    // Valida antes de salvar para evitar pacote corrompido.
    var obj = JSON.parse(txt);
    if (!obj || typeof obj !== 'object') return { ok:false, mensagem:'Pacote inválido.' };

    var codigo = _mcCodigoV707_();
    var chave = _mcChaveV707_();
    var meta = _mcSalvarV707_(codigo, chave, txt);
    var api = ScriptApp.getService().getUrl();
    if (!api) return { ok:false, mensagem:'URL do aplicativo da Web indisponível. Faça uma nova implantação.' };

    var link = MC_V707_PWA_URL
      + '?pacote=' + encodeURIComponent(codigo)
      + '&chave=' + encodeURIComponent(chave)
      + '&api=' + encodeURIComponent(api);

    return {
      ok:true,
      codigo:codigo,
      chave:chave,
      link:link,
      api:api,
      partes:meta.partes,
      tamanho:meta.tamanho,
      expiraEmSegundos:MC_V707_TTL
    };
  } catch (e) {
    return { ok:false, mensagem:'Falha ao criar pacote do Modo Campo: ' + String(e && e.message ? e.message : e) };
  }
}

function _mcResponderPacoteV707_(p) {
  try {
    var r = _mcLerV707_(p.codigo, p.chave);
    return _mcJsonpV707_(p.callback, { ok:true, pacote:r.pacote, criadoEm:r.meta.criadoEm });
  } catch (e) {
    return _mcJsonpV707_(p.callback, { ok:false, mensagem:String(e && e.message ? e.message : e) });
  }
}

function _mcNomePdfV707_(d, indice) {
  var cod = String((d && (d.codigo || d.geocod || d.GEOCOD_IEF)) || ('demanda_' + (Number(indice) + 1)));
  return ('demanda_' + cod + '.pdf').replace(/[^A-Za-z0-9._-]+/g, '_');
}

function _mcExtrairDriveIdPdfV715_(url) {
  url = String(url || '').trim();
  var m = url.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/i);
  if (m) return m[1];
  m = url.match(/drive\.google\.com\/(?:open|uc)\?[^#]*\bid=([A-Za-z0-9_-]+)/i);
  if (m) return m[1];
  m = url.match(/[?&]id=([A-Za-z0-9_-]+)/i);
  if (m && /drive\.google\.com/i.test(url)) return m[1];
  return '';
}

function _mcBlobPdfV715_(url) {
  url = String(url || '').trim();
  if (!url) throw new Error('Link do PDF vazio.');

  // 1) Google Drive: prefere DriveApp, pois evita receber página HTML de visualização/login.
  var driveId = _mcExtrairDriveIdPdfV715_(url);
  if (driveId) {
    try {
      var arq = DriveApp.getFileById(driveId);
      var blobDrive = arq.getBlob();
      var bytesDrive = blobDrive.getBytes();
      if (!bytesDrive || !bytesDrive.length) throw new Error('Arquivo do Drive vazio.');
      return {
        blob: blobDrive,
        bytes: bytesDrive,
        nome: arq.getName() || 'documento.pdf',
        origem: 'DriveApp'
      };
    } catch (eDrive) {
      // Se o script não tiver acesso ao arquivo, ainda tentaremos URL direta abaixo.
      console.log('Modo Campo PDF - DriveApp falhou: ' + (eDrive && eDrive.message ? eDrive.message : eDrive));
    }
  }

  // 2) Google Docs: exporta como PDF.
  var md = url.match(/docs\.google\.com\/document\/d\/([A-Za-z0-9_-]+)/i);
  if (md) {
    url = 'https://docs.google.com/document/d/' + md[1] + '/export?format=pdf';
  } else if (driveId) {
    // fallback de download direto para arquivo do Drive
    url = 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(driveId);
  }

  // 3) URLs externas.
  var resp = UrlFetchApp.fetch(url, {
    method:'get',
    muteHttpExceptions:true,
    followRedirects:true,
    headers:{
      'User-Agent':'Mozilla/5.0 GoogleAppsScript ModoCampo',
      'Accept':'application/pdf,application/octet-stream;q=0.9,*/*;q=0.1'
    }
  });
  var status = Number(resp.getResponseCode() || 0);
  if (status < 200 || status >= 300) throw new Error('PDF respondeu HTTP ' + status + '.');

  var blob = resp.getBlob();
  var bytes = blob.getBytes();
  if (!bytes || !bytes.length) throw new Error('Documento vazio.');

  return {
    blob: blob,
    bytes: bytes,
    nome: '',
    origem: 'UrlFetchApp',
    headers: resp.getAllHeaders ? resp.getAllHeaders() : {}
  };
}

function _mcEhPdfBytesV715_(bytes) {
  return !!(bytes && bytes.length >= 5 &&
    bytes[0] === 37 && bytes[1] === 80 && bytes[2] === 68 && bytes[3] === 70 && bytes[4] === 45); // %PDF-
}

function _mcResponderPdfV707_(p) {
  try {
    var r = _mcLerV707_(p.codigo, p.chave);
    var ds = Array.isArray(r.pacote.demandas) ? r.pacote.demandas : [];
    var i = Number(p.indice);
    if (!isFinite(i) || i < 0 || i >= ds.length) throw new Error('Índice do PDF inválido.');

    var d = ds[i] || {};
    var url = String(d.pdfUrl || '').trim();
    if (!url) throw new Error('Esta demanda não possui PDF vinculado.');

    var obt = _mcBlobPdfV715_(url);
    var bytes = obt.bytes || [];
    if (!_mcEhPdfBytesV715_(bytes)) {
      var tipo = '';
      try { tipo = String(obt.blob && obt.blob.getContentType ? obt.blob.getContentType() : ''); } catch (_) {}
      throw new Error(
        'O link não retornou um PDF real' +
        (tipo ? ' (tipo recebido: ' + tipo + ')' : '') +
        '. Verifique se o link aponta diretamente para um arquivo PDF e se o Apps Script possui acesso ao arquivo.'
      );
    }

    var limite = 8 * 1024 * 1024;
    if (bytes.length > limite) throw new Error('PDF maior que 8 MB. Este documento não será armazenado offline nesta versão.');

    var nome = String(obt.nome || _mcNomePdfV707_(d, i) || 'documento.pdf');
    if (!/\.pdf$/i.test(nome)) nome += '.pdf';
    nome = nome.replace(/[\\/:*?"<>|]+/g, '_');

    return _mcJsonpV707_(p.callback, {
      ok:true,
      nome:nome,
      mime:'application/pdf',
      tamanho:bytes.length,
      origem:obt.origem || '',
      base64:Utilities.base64Encode(bytes)
    });
  } catch (e) {
    return _mcJsonpV707_(p.callback, {
      ok:false,
      mensagem:String(e && e.message ? e.message : e)
    });
  }
}


function getDemandas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(NOME_ABA_MAPA);
  if (!sh) throw new Error(`A aba "${NOME_ABA_MAPA}" não foi encontrada.`);

  const lastRow = sh.getLastRow();
  const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'America/Sao_Paulo';
  if (lastRow < 2) {
    return { atualizadoEm: formatarDataHora(new Date(), tz), total: 0, registros: [] };
  }

  const values = sh.getRange(2, 1, lastRow - 1, 9).getValues();
  const registros = [];

  values.forEach((r, i) => {
    const tipo = texto(r[0]);
    const codigo = texto(r[1]);
    const dataAtendimento = formatarData(r[6], tz);

    // V5: atendidas não são computadas nem enviadas ao navegador.
    if (dataAtendimento) return;

    const lat = numeroCoordenada(r[7]);
    const lon = numeroCoordenada(r[8]);
    if (lat === null || lon === null || lat < -90 || lat > 90 || lon < -180 || lon > 180) return;

    registros.push({
      linhaCentral: i + 2,
      tipo,
      codigo,
      dataGerada: formatarData(r[2], tz),
      dataGeradaIso: dataIso(r[2]),
      natureza: texto(r[3]).trim(),
      municipio: texto(r[4]).trim(),
      endereco: texto(r[5]).trim(),
      lat,
      lon
    });
  });

  // V7.0.11: o mapa abre imediatamente. O enriquecimento de prazos
  // é solicitado em segundo plano pelo navegador, sem bloquear os pontos.
  return {
    atualizadoEm: formatarDataHora(new Date(), tz),
    total: registros.length,
    registros
  };
}

/**
 * V5.7 - Enriquecimento dos prazos de atendimento.
 * Abre cada fonte apenas uma vez, indexa os registros pela chave oficial e
 * acrescenta data de recebimento, prazo e data de vencimento às demandas.
 * Se uma fonte/registro não puder ser localizado com segurança, o mapa continua
 * funcionando e aquele ponto aparece como "prazo não calculado".
 */
function enriquecerPrazosDemandas(registros) {
  const grupos = {};
  registros.forEach(d => {
    try {
      const fonte = fontePorTipo(d.tipo);
      if (!grupos[fonte]) grupos[fonte] = [];
      grupos[fonte].push(d);
    } catch (e) {
      d.prazoErro = e.message;
    }
  });

  Object.keys(grupos).forEach(nomeFonte => {
    const cfg = FONTES[nomeFonte];
    const demandasFonte = grupos[nomeFonte];
    if (!cfg || !cfg.prazoDias || !(cfg.recebimentoHeaders || []).length) return;

    try {
      const ss = SpreadsheetApp.openById(cfg.spreadsheetId);
      const sh = getSheetById(ss, cfg.sheetId);
      if (!sh) throw new Error(`A aba configurada (${cfg.sheetId}) não foi encontrada.`);

      const estrutura = detectarEstruturaCabecalho(sh, cfg);
      const mapaHeaders = mapearHeaders(estrutura.headers);
      const colChave = localizarColuna(mapaHeaders, cfg.chaveHeaders || []);
      const colRecebimento = localizarColuna(mapaHeaders, cfg.recebimentoHeaders || []);
      if (!colChave || !colRecebimento) {
        throw new Error('Coluna de chave ou de recebimento não encontrada.');
      }

      const primeiraLinhaDados = estrutura.linhaCabecalho + 1;
      const qtdLinhas = sh.getLastRow() - primeiraLinhaDados + 1;
      if (qtdLinhas < 1) return;

      const lastCol = sh.getLastColumn();
      const range = sh.getRange(primeiraLinhaDados, 1, qtdLinhas, lastCol);
      const valores = range.getValues();
      const exibidos = range.getDisplayValues();
      const indice = new Map();

      valores.forEach((r, idx) => {
        const chave = normalizarCodigo(exibidos[idx][colChave - 1]);
        if (!chave) return;
        const data = dataComoObjeto(r[colRecebimento - 1]);
        if (!data) return;

        // Chave repetida fica marcada como ambígua e não será usada.
        if (indice.has(chave)) indice.set(chave, null);
        else indice.set(chave, data);
      });

      const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'America/Sao_Paulo';
      demandasFonte.forEach(d => {
        const candidatos = candidatosDeCodigo(d.codigo, cfg.removerPrefixosCodigo || []);
        const encontrados = [];
        candidatos.forEach(c => {
          if (indice.has(c) && indice.get(c)) encontrados.push(indice.get(c));
        });
        const unicos = [...new Map(encontrados.map(dt => [dt.getTime(), dt])).values()];
        if (unicos.length !== 1) return;

        const recebimento = unicos[0];
        const vencimento = somarDiasData(recebimento, Number(cfg.prazoDias));
        d.prazoDias = Number(cfg.prazoDias);
        d.dataRecebimento = Utilities.formatDate(recebimento, tz, 'dd/MM/yyyy');
        d.dataRecebimentoIso = Utilities.formatDate(recebimento, tz, 'yyyy-MM-dd');
        d.dataVencimento = Utilities.formatDate(vencimento, tz, 'dd/MM/yyyy');
        d.dataVencimentoIso = Utilities.formatDate(vencimento, tz, 'yyyy-MM-dd');
      });
    } catch (e) {
      console.log(`Prazo ${nomeFonte}: ${e.message}`);
      demandasFonte.forEach(d => d.prazoErro = e.message);
    }
  });
}

function dataComoObjeto(v) {
  if (!v) return null;
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v)) {
    return new Date(v.getFullYear(), v.getMonth(), v.getDate());
  }
  const s = String(v).trim();
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    return isNaN(d) ? null : d;
  }
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(d) ? null : d;
  }
  return null;
}

function somarDiasData(data, dias) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + Number(dias || 0));
}

/**
 * Carrega, sob demanda, o registro de origem e os campos do formulário.
 * Recebe o objeto do marcador para permitir fallback seguro de localização.
 */
function getDetalhesDemanda(demanda) {
  validarDemandaEntrada(demanda);
  const resolvida = localizarRegistroOrigem(demanda);
  const cfg = resolvida.cfg;
  const valores = resolvida.valores;
  const mapaHeaders = resolvida.mapaHeaders;
  const tz = resolvida.ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'America/Sao_Paulo';

  const campos = cfg.camposResposta.map(campo => {
    const col = localizarColuna(mapaHeaders, campo.headers);
    const valor = col ? valores[col - 1] : '';
    return {
      id: campo.id,
      label: campo.label,
      tipo: campo.tipo || 'text',
      obrigatorio: Boolean(campo.obrigatorio),
      opcoes: Array.isArray(campo.opcoes) ? campo.opcoes : [],
      disponivel: Boolean(col),
      valor: valorParaFormulario(valor, campo.tipo, tz)
    };
  });

  const pdfCol = localizarColuna(mapaHeaders, cfg.pdfHeaders || []);
  const pdfUrl = pdfCol ? texto(valores[pdfCol - 1]) : '';

  return {
    encontrado: true,
    origem: resolvida.nomeFonte,
    linhaOrigem: resolvida.linha,
    nomeArquivo: resolvida.ss.getName(),
    nomeAba: resolvida.sh.getName(),
    planilhaUrl: `https://docs.google.com/spreadsheets/d/${cfg.spreadsheetId}/edit#gid=${cfg.sheetId}`,
    pdfUrl: urlValida(pdfUrl) ? pdfUrl : '',
    campos,
    avisoLocalizacao: resolvida.metodo === 'fallback'
      ? 'Registro localizado por data/município/natureza. Confira os dados antes de salvar.'
      : ''
  };
}

/** Grava somente os campos de resposta configurados para a fonte. */
function salvarRespostaDemanda(payload) {
  if (!payload || !payload.demanda || !payload.valores) {
    throw new Error('Dados da resposta incompletos.');
  }

  validarDemandaEntrada(payload.demanda);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    // Localizamos novamente no momento da gravação; não confiamos em número de linha do navegador.
    const resolvida = localizarRegistroOrigem(payload.demanda);
    const cfg = resolvida.cfg;
    const mapaHeaders = resolvida.mapaHeaders;
    const sh = resolvida.sh;
    const tz = resolvida.ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'America/Sao_Paulo';

    // V5.2: por segurança, gravação é permitida SOMENTE quando o registro foi
    // localizado pela chave oficial da fonte. O fallback continua útil apenas
    // para consulta/diagnóstico, nunca para escrita.
    if (resolvida.metodo !== 'codigo') {
      throw new Error('A gravação foi bloqueada por segurança porque o registro não foi localizado pela chave oficial da demanda. Nenhum dado foi alterado.');
    }

    // Bloqueia resposta duplicada quando a origem já possui data de atendimento.
    const campoData = cfg.camposResposta.find(c => c.id === 'dataAtendimento');
    const colDataAtendimento = campoData ? localizarColuna(mapaHeaders, campoData.headers) : 0;
    if (!colDataAtendimento) {
      throw new Error('A coluna de data do atendimento não foi encontrada na planilha de origem. Nenhum dado foi alterado.');
    }
    const dataAtual = sh.getRange(resolvida.linha, colDataAtendimento).getValue();
    if (texto(formatarData(dataAtual, tz))) {
      throw new Error(`Esta demanda já possui DATA DE ATENDIMENTO (${formatarData(dataAtual, tz)}). A gravação foi bloqueada para evitar duplicidade.`);
    }

    // Primeiro valida e prepara TODAS as alterações. Só depois escreve na planilha,
    // evitando atualização parcial caso algum campo obrigatório esteja inválido.
    const preparadas = [];
    cfg.camposResposta.forEach(campo => {
      const col = localizarColuna(mapaHeaders, campo.headers);
      if (!col) return;

      const recebido = Object.prototype.hasOwnProperty.call(payload.valores, campo.id)
        ? payload.valores[campo.id]
        : undefined;
      if (recebido === undefined) return;
      if (campo.obrigatorio && !texto(recebido)) {
        throw new Error(`Preencha o campo obrigatório: ${campo.label}.`);
      }
      if (campo.tipo === 'select' && texto(recebido)) {
        const permitidas = (campo.opcoes || []).map(texto);
        if (!permitidas.includes(texto(recebido))) {
          throw new Error(`Valor inválido para ${campo.label}. Selecione uma das opções disponíveis.`);
        }
      }
      if (campo.tipo === 'gaia' && texto(recebido)) {
        validarFormatoGaia(recebido);
      }

      const valorGravacao = campo.tipo === 'date'
        ? converterDataFormulario(recebido)
        : texto(recebido);
      preparadas.push({ campo, col, valorGravacao });
    });

    const dataPreparada = preparadas.find(x => x.campo.id === 'dataAtendimento' && x.valorGravacao);
    if (!dataPreparada) {
      throw new Error('Informe a data do atendimento. Nenhum dado foi alterado.');
    }

    // V5.4: para Balcão, Monitoramento Contínuo e Previncêndio,
    // o preenchimento da data de atendimento define STATUS = ATENDIDA automaticamente.
    if (cfg.statusAutomatico && dataPreparada) {
      const colStatus = localizarColuna(mapaHeaders, cfg.statusAutomatico.headers || []);
      if (!colStatus) {
        throw new Error('A coluna STATUS não foi encontrada na planilha de origem. Nenhum dado foi alterado.');
      }
      preparadas.push({
        campo: { id: '_statusAutomatico', label: 'Status' },
        col: colStatus,
        valorGravacao: cfg.statusAutomatico.valor || 'ATENDIDA'
      });
    }

    const alteracoes = [];
    preparadas.forEach(item => {
      const cell = sh.getRange(resolvida.linha, item.col);
      cell.setValue(item.valorGravacao);
      if (item.campo.tipo === 'date' && item.valorGravacao) cell.setNumberFormat('dd/MM/yyyy');
      alteracoes.push(item.campo.label);
    });

    const dataAtendimentoGravada = Utilities.formatDate(dataPreparada.valorGravacao, tz, 'dd/MM/yyyy');
    SpreadsheetApp.flush();

    return {
      sucesso: true,
      mensagem: 'Resposta registrada com sucesso.',
      origem: resolvida.nomeFonte,
      arquivo: resolvida.ss.getName(),
      aba: sh.getName(),
      linha: resolvida.linha,
      dataAtendimento: dataAtendimentoGravada,
      camposAlterados: alteracoes
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Retorna o URL do PDF/pasta usado pelo botão do popup.
 * V5.3: aceita URL direta, hiperlink de RichText e fórmulas
 * =HYPERLINK("URL"; IMAGE("...")) / =HIPERLINK("URL"; ...).
 */
function getLinkDocumento(demanda) {
  validarDemandaEntrada(demanda);
  const resolvida = localizarRegistroOrigem(demanda);
  const col = localizarColuna(resolvida.mapaHeaders, resolvida.cfg.pdfHeaders || []);
  if (!col) return { url: '', mensagem: 'Esta planilha ainda não possui uma coluna de link para o documento.' };

  const cell = resolvida.sh.getRange(resolvida.linha, col);
  const url = extrairUrlDaCelula(cell);
  if (!urlValida(url)) return { url: '', mensagem: 'Não há PDF/pasta cadastrado para esta demanda.' };
  return { url, mensagem: '' };
}

/** Extrai o destino real de uma célula que contenha link. */
function extrairUrlDaCelula(cell) {
  // 1) Fórmula HYPERLINK/HIPERLINK: pega o PRIMEIRO URL, que é o destino.
  const formula = cell.getFormula() || '';
  if (formula) {
    // Primeiro tenta especificamente o primeiro argumento de HYPERLINK/HIPERLINK.
    let m = formula.match(/(?:HYPERLINK|HIPERLINK)\s*\(\s*["'](https?:\/\/[^"']+)["']/i);
    if (m && m[1]) return m[1].replace(/""/g, '"').trim();

    // Fallback: primeiro URL da fórmula (evita usar o URL do ícone IMAGE).
    m = formula.match(/https?:\/\/[^"'\s;)]+/i);
    if (m && m[0]) return m[0].trim();
  }

  // 2) Hiperlink aplicado como RichText.
  try {
    const rich = cell.getRichTextValue();
    if (rich) {
      const link = rich.getLinkUrl();
      if (link) return String(link).trim();
      const runs = rich.getRuns ? rich.getRuns() : [];
      for (let i = 0; i < runs.length; i++) {
        const runLink = runs[i].getLinkUrl();
        if (runLink) return String(runLink).trim();
      }
    }
  } catch (e) {}

  // 3) URL escrita diretamente na célula.
  const display = texto(cell.getDisplayValue());
  if (urlValida(display)) return display;
  const raw = texto(cell.getValue());
  if (urlValida(raw)) return raw;

  return '';
}

/**
 * Diagnóstico sem gravação. Pode ser executado manualmente no editor do Apps Script
 * antes de publicar a nova versão.
 */
function diagnosticoFontes() {
  const resultado = [];
  Object.keys(FONTES).forEach(nomeFonte => {
    const cfg = FONTES[nomeFonte];
    try {
      const ss = SpreadsheetApp.openById(cfg.spreadsheetId);
      const sh = getSheetById(ss, cfg.sheetId);
      if (!sh) throw new Error(`gid ${cfg.sheetId} não encontrado`);
      const estrutura = detectarEstruturaCabecalho(sh, cfg);
      const headers = estrutura.headers;
      resultado.push({
        fonte: nomeFonte,
        ok: true,
        arquivo: ss.getName(),
        aba: sh.getName(),
        linhaCabecalho: estrutura.linhaCabecalho,
        pontuacaoCabecalho: estrutura.pontuacao,
        chaveEncontrada: nomeColunaEncontrada(headers, cfg.chaveHeaders),
        recebimentoEncontrado: nomeColunaEncontrada(headers, cfg.recebimentoHeaders || []),
        prazoDias: cfg.prazoDias || '',
        documentoEncontrado: nomeColunaEncontrada(headers, cfg.pdfHeaders || []),
        camposResposta: cfg.camposResposta.map(c => ({
          campo: c.label,
          coluna: nomeColunaEncontrada(headers, c.headers) || 'NÃO ENCONTRADA'
        })),
        statusAutomatico: cfg.statusAutomatico
          ? {
              valor: cfg.statusAutomatico.valor || 'ATENDIDA',
              coluna: nomeColunaEncontrada(headers, cfg.statusAutomatico.headers || []) || 'NÃO ENCONTRADA'
            }
          : null
      });
    } catch (e) {
      resultado.push({ fonte: nomeFonte, ok: false, erro: e.message });
    }
  });
  console.log(JSON.stringify(resultado, null, 2));
  return resultado;
}

function localizarRegistroOrigem(demanda) {
  const nomeFonte = fontePorTipo(demanda.tipo);
  const cfg = FONTES[nomeFonte];
  if (!cfg) throw new Error(`Tipo de demanda não configurado: ${demanda.tipo}.`);

  const ss = SpreadsheetApp.openById(cfg.spreadsheetId);
  const sh = getSheetById(ss, cfg.sheetId);
  if (!sh) throw new Error(`A aba configurada (${cfg.sheetId}) não foi encontrada na fonte ${nomeFonte}.`);

  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  if (lastRow < 2 || lastCol < 1) throw new Error(`A planilha ${nomeFonte} não possui registros.`);

  // V5.2: a linha de cabeçalho é detectada automaticamente nas primeiras linhas.
  const estrutura = detectarEstruturaCabecalho(sh, cfg);
  const headers = estrutura.headers;
  const mapaHeaders = mapearHeaders(headers);
  const primeiraLinhaDados = estrutura.linhaCabecalho + 1;
  const qtdLinhasDados = lastRow - primeiraLinhaDados + 1;
  if (qtdLinhasDados < 1) throw new Error(`A planilha ${nomeFonte} não possui registros abaixo do cabeçalho.`);

  // 1) Busca pelos identificadores configurados.
  const candidatosCodigo = candidatosDeCodigo(demanda.codigo, cfg.removerPrefixosCodigo || []);
  for (const headerChave of cfg.chaveHeaders || []) {
    const col = localizarColuna(mapaHeaders, [headerChave]);
    if (!col) continue;

    const range = sh.getRange(primeiraLinhaDados, col, qtdLinhasDados, 1);
    const display = range.getDisplayValues();
    const matches = [];

    display.forEach((r, idx) => {
      const origem = normalizarCodigo(r[0]);
      if (candidatosCodigo.some(c => origem === c)) matches.push(idx + primeiraLinhaDados);
    });

    if (matches.length === 1) {
      const linha = matches[0];
      return {
        cfg, nomeFonte, ss, sh, linha, mapaHeaders,
        valores: sh.getRange(linha, 1, 1, lastCol).getValues()[0],
        metodo: 'codigo'
      };
    }
    if (matches.length > 1) {
      throw new Error(`Foram encontrados ${matches.length} registros com o código ${demanda.codigo} na fonte ${nomeFonte}. A gravação foi bloqueada por segurança.`);
    }
  }

  // 2) Fallback conservador: pontua data, município e natureza.
  const dados = sh.getRange(primeiraLinhaDados, 1, qtdLinhasDados, lastCol).getValues();
  const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'America/Sao_Paulo';
  const colData = localizarColuna(mapaHeaders, cfg.dataHeaders || []);
  const colMun = localizarColuna(mapaHeaders, cfg.municipioHeaders || []);
  const colNat = localizarColuna(mapaHeaders, cfg.naturezaHeaders || []);
  const alvoData = normalizarDataComparacao(demanda.dataGerada, tz);
  const alvoMun = normalizar(demanda.municipio);
  const alvoNat = normalizar(demanda.natureza);

  const pontuados = [];
  dados.forEach((r, idx) => {
    let pontos = 0;
    let comparacoes = 0;

    if (colData && alvoData) {
      comparacoes++;
      if (normalizarDataComparacao(r[colData - 1], tz) === alvoData) pontos += 3;
    }
    if (colMun && alvoMun) {
      comparacoes++;
      if (normalizar(r[colMun - 1]) === alvoMun) pontos += 3;
    }
    if (colNat && alvoNat) {
      comparacoes++;
      const n = normalizar(r[colNat - 1]);
      if (n && (n === alvoNat || n.includes(alvoNat) || alvoNat.includes(n))) pontos += 1;
    }

    if (comparacoes >= 2 && pontos >= 6) pontuados.push({ linha: idx + primeiraLinhaDados, pontos });
  });

  pontuados.sort((a, b) => b.pontos - a.pontos);
  if (pontuados.length === 1 || (pontuados.length > 1 && pontuados[0].pontos > pontuados[1].pontos)) {
    const linha = pontuados[0].linha;
    return {
      cfg, nomeFonte, ss, sh, linha, mapaHeaders,
      valores: sh.getRange(linha, 1, 1, lastCol).getValues()[0],
      metodo: 'fallback'
    };
  }

  throw new Error(
    `Não foi possível localizar com segurança a demanda ${demanda.codigo || '(sem código)'} ` +
    `na fonte ${nomeFonte}. Nenhum dado foi alterado.`
  );
}


/**
 * V5.2 - Detecta automaticamente a linha real dos cabeçalhos.
 * Examina as primeiras 25 linhas e escolhe a que mais combina com os
 * identificadores, campos de resposta, PDF, data, município e natureza
 * configurados para a fonte.
 */
function detectarEstruturaCabecalho(sh, cfg) {
  const lastRow = sh.getLastRow();
  const lastCol = Math.max(1, sh.getLastColumn());
  const limite = Math.min(25, Math.max(1, lastRow));
  const matriz = sh.getRange(1, 1, limite, lastCol).getDisplayValues();

  const grupos = [];
  if (cfg.chaveHeaders && cfg.chaveHeaders.length) grupos.push({ candidatos: cfg.chaveHeaders, peso: 8, nome: 'chave' });
  if (cfg.pdfHeaders && cfg.pdfHeaders.length) grupos.push({ candidatos: cfg.pdfHeaders, peso: 2, nome: 'documento' });
  if (cfg.dataHeaders && cfg.dataHeaders.length) grupos.push({ candidatos: cfg.dataHeaders, peso: 3, nome: 'data' });
  if (cfg.recebimentoHeaders && cfg.recebimentoHeaders.length) grupos.push({ candidatos: cfg.recebimentoHeaders, peso: 4, nome: 'recebimento' });
  if (cfg.municipioHeaders && cfg.municipioHeaders.length) grupos.push({ candidatos: cfg.municipioHeaders, peso: 3, nome: 'municipio' });
  if (cfg.naturezaHeaders && cfg.naturezaHeaders.length) grupos.push({ candidatos: cfg.naturezaHeaders, peso: 2, nome: 'natureza' });
  (cfg.camposResposta || []).forEach(c => grupos.push({ candidatos: c.headers || [], peso: c.obrigatorio ? 5 : 2, nome: c.id }));

  let melhor = null;
  matriz.forEach((headers, idx) => {
    const mapa = mapearHeaders(headers);
    let pontos = 0;
    let gruposEncontrados = 0;
    grupos.forEach(g => {
      if (localizarColuna(mapa, g.candidatos)) {
        pontos += g.peso;
        gruposEncontrados++;
      }
    });

    // Pequeno bônus para linhas com vários textos preenchidos, típico de cabeçalho.
    const preenchidos = headers.filter(v => texto(v)).length;
    if (preenchidos >= 3) pontos += Math.min(3, Math.floor(preenchidos / 3));

    const candidato = { linhaCabecalho: idx + 1, headers, pontuacao: pontos, gruposEncontrados };
    if (!melhor || candidato.pontuacao > melhor.pontuacao ||
        (candidato.pontuacao === melhor.pontuacao && candidato.gruposEncontrados > melhor.gruposEncontrados)) {
      melhor = candidato;
    }
  });

  if (!melhor || melhor.pontuacao < 3) {
    throw new Error('Não foi possível identificar automaticamente a linha de cabeçalhos nas primeiras 25 linhas.');
  }
  return melhor;
}

function fontePorTipo(tipo) {
  const t = normalizar(tipo);
  if (t === 'DDU') return 'DDU';
  if (t === 'DENUNCIA' || t === 'NUDEN') return 'NUDEN';
  if (t === 'REQUISICAO' || t === 'REQUISICOES') return 'REQUISICOES';
  if (t === 'MONITORAMENTO CONTINUO' || t === 'MONITORAMENTO') return 'MONITORAMENTO';
  if (t === 'NEA') return 'NEA';
  if (t === 'PREVINCENDIO' || t === 'PREV INCENDIO' || t === 'PREVINCENDIO') return 'PREVINCENDIO';
  if (t === 'BALCAO') return 'BALCAO';
  throw new Error(`Não existe fonte configurada para o tipo "${tipo}".`);
}

function validarDemandaEntrada(d) {
  if (!d || !texto(d.tipo)) throw new Error('Tipo de demanda não informado.');
  if (!texto(d.codigo) && !texto(d.dataGerada)) throw new Error('Demanda sem identificador suficiente para localização.');
}

function getSheetById(ss, sheetId) {
  return ss.getSheets().find(s => s.getSheetId() === Number(sheetId)) || null;
}

function mapearHeaders(headers) {
  const mapa = {};
  headers.forEach((h, idx) => {
    const k = normalizar(h);
    if (k && !mapa[k]) mapa[k] = idx + 1;
  });
  return mapa;
}

function localizarColuna(mapaHeaders, candidatos) {
  for (const h of candidatos || []) {
    const col = mapaHeaders[normalizar(h)];
    if (col) return col;
  }
  return 0;
}

function nomeColunaEncontrada(headers, candidatos) {
  const mapa = mapearHeaders(headers);
  const col = localizarColuna(mapa, candidatos);
  return col ? headers[col - 1] : '';
}

function candidatosDeCodigo(codigo, prefixos) {
  const base = normalizarCodigo(codigo);
  const set = new Set();
  if (base) set.add(base);

  (prefixos || []).forEach(p => {
    const pn = normalizarCodigo(p);
    if (pn && base.startsWith(pn) && base.length > pn.length) {
      set.add(base.substring(pn.length));
    }
  });

  // Variações úteis de ofício/protocolo sem espaços e sinais.
  if (base) {
    set.add(base.replace(/^OF/, ''));
    set.add(base.replace(/^OFICIO/, ''));
    set.add(base.replace(/^RI/, ''));
  }
  return [...set].filter(Boolean);
}

function normalizarCodigo(v) {
  return normalizar(v).replace(/[^A-Z0-9]/g, '');
}

function normalizar(v) {
  return texto(v)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function texto(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function numeroCoordenada(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;

  let s = String(v).trim().replace(',', '.');
  let n = Number(s);
  if (!Number.isFinite(n)) return null;

  // Corrige coordenadas eventualmente armazenadas sem separador decimal,
  // ex.: -19552139 -> -19.552139; -44217833 -> -44.217833.
  while (Math.abs(n) > 180) n = n / 10;
  return Number.isFinite(n) ? n : null;
}

function formatarData(v, tz) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v)) {
    return Utilities.formatDate(v, tz, 'dd/MM/yyyy');
  }
  return String(v).trim();
}

function formatarDataHora(v, tz) {
  return Utilities.formatDate(v, tz, 'dd/MM/yyyy HH:mm:ss');
}

function dataIso(v) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v)) return v.toISOString();
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    if (!isNaN(d)) return d.toISOString();
  }
  return '';
}

function normalizarDataComparacao(v, tz) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v)) {
    return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  }
  const s = String(v).trim();
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${('0' + m[2]).slice(-2)}-${('0' + m[1]).slice(-2)}`;
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return '';
}


/** Valida o padrão institucional do GAIA: ANO.MM.01.362.000 + sequência final. */
function validarFormatoGaia(valor) {
  const v = texto(valor).trim();
  const m = v.match(/^(\d{4})\.(\d{2})\.01\.362\.000(\d+)$/);
  if (!m) {
    throw new Error('Número do GAIA inválido. Use o padrão ANO.MÊS.01.362.000 + números finais (ex.: 2026.06.01.362.0002379).');
  }
  const mes = Number(m[2]);
  if (mes < 1 || mes > 12) {
    throw new Error('Mês inválido no número do GAIA. Informe um mês entre 01 e 12.');
  }
  return v;
}

function converterDataFormulario(v) {
  const s = texto(v);
  if (!s) return '';
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new Error('Data inválida. Use o formato exibido pelo seletor de data.');
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (isNaN(d)) throw new Error('Data de atendimento inválida.');
  return d;
}

function valorParaFormulario(v, tipo, tz) {
  if (tipo === 'date') {
    if (!v) return '';
    if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v)) {
      return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
    }
    const normal = normalizarDataComparacao(v, tz);
    return normal;
  }
  return texto(v);
}

function urlValida(v) {
  return /^https?:\/\//i.test(texto(v));
}


/* ============================================================
   V6.2 - IDE-SISEMA BÁSICO
   Carregamento sob demanda. Não é executado na abertura do mapa.
   ============================================================ */

const IDE_V62_WMS_URL = 'https://geoserver.meioambiente.mg.gov.br/wms';

function getIDECatalogV62() {
  try {
    const propsV626 = PropertiesService.getScriptProperties();
    const salvoV626 = propsV626.getProperty('IDE_CATALOGO_V626');
    if (salvoV626) {
      try {
        const c = JSON.parse(salvoV626);
        if (c && c.layers && c.layers.length) {
          c.ok = true; c.cache = true;
          return c;
        }
      } catch(e) {}
    }
    const url = IDE_V62_WMS_URL +
      '?service=WMS&request=GetCapabilities&version=1.3.0&_=' + new Date().getTime();

    const resp = UrlFetchApp.fetch(url, {
      method:'get', muteHttpExceptions:true, followRedirects:true
    });

    const status = resp.getResponseCode();
    if (status < 200 || status >= 300) {
      throw new Error('IDE-Sisema respondeu HTTP ' + status);
    }

    const xml = resp.getContentText();
    const doc = XmlService.parse(xml);
    const root = doc.getRootElement();
    const ns = root.getNamespace();

    let capability = root.getChild('Capability', ns);
    if (!capability) capability = root.getChild('Capability');
    if (!capability) throw new Error('Capability não encontrado no WMS.');

    let raiz = capability.getChild('Layer', ns);
    if (!raiz) raiz = capability.getChild('Layer');
    if (!raiz) throw new Error('Catálogo de camadas não encontrado.');

    const saida = [];
    coletarCamadasIDEV62_(raiz, ns, saida);

    const unicas = {};
    saida.forEach(c => { if (c.name && !unicas[c.name]) unicas[c.name] = c; });

    const layers = Object.keys(unicas).map(k => unicas[k]).sort((a,b) =>
      String(a.title || a.name).localeCompare(String(b.title || b.name), 'pt-BR')
    );

    const resultadoV626 = {
      ok:true, wmsUrl:IDE_V62_WMS_URL, total:layers.length, layers:layers,
      atualizadoEm:formatarDataHora(new Date(), Session.getScriptTimeZone()), cache:false
    };
    try { propsV626.setProperty('IDE_CATALOGO_V626', JSON.stringify(resultadoV626)); } catch(e) {}
    return resultadoV626;
  } catch (e) {
    return { ok:false, erro:String(e && e.message ? e.message : e), layers:[] };
  }
}

function coletarCamadasIDEV62_(node, ns, out) {
  const child = (n) => node.getChild(n, ns) || node.getChild(n);
  const nomeEl = child('Name');
  const tituloEl = child('Title');
  const absEl = child('Abstract');

  if (nomeEl) {
    out.push({
      name: nomeEl.getText(),
      title: tituloEl ? tituloEl.getText() : nomeEl.getText(),
      abstract: absEl ? absEl.getText() : ''
    });
  }

  let filhos = node.getChildren('Layer', ns);
  if (!filhos || !filhos.length) filhos = node.getChildren('Layer');
  filhos.forEach(f => coletarCamadasIDEV62_(f, ns, out));
}


/* V6.2.1 — Execute UMA VEZ no editor do Apps Script para conceder
   a permissão externa necessária ao módulo IDE-SISEMA. */
function autorizarIDEV621() {
  const resposta = UrlFetchApp.fetch(
    'https://geoserver.meioambiente.mg.gov.br/wms?service=WMS&request=GetCapabilities&version=1.3.0',
    { method:'get', muteHttpExceptions:true, followRedirects:true }
  );
  return 'IDE-SISEMA autorizado. HTTP ' + resposta.getResponseCode();
}


/* ============================================================
   V6.2.4 - IDE-SISEMA: IDENTIFICAR FEIÇÃO (GetFeatureInfo)
   ============================================================ */
function getIDEFeatureInfoV624(p) {
  try {
    if (!p) throw new Error('Parâmetros não informados.');

    const layers = Array.isArray(p.layers) ? p.layers.filter(String) : [];
    if (!layers.length) throw new Error('Nenhuma camada IDE ativa.');

    const bbox = String(p.bbox || '');
    const width = Math.max(1, parseInt(p.width, 10) || 1);
    const height = Math.max(1, parseInt(p.height, 10) || 1);
    const x = Math.max(0, parseInt(p.x, 10) || 0);
    const y = Math.max(0, parseInt(p.y, 10) || 0);

    const params = {
      service: 'WMS',
      version: '1.1.1',
      request: 'GetFeatureInfo',
      layers: layers.join(','),
      query_layers: layers.join(','),
      styles: '',
      bbox: bbox,
      width: width,
      height: height,
      srs: 'EPSG:4326',
      format: 'image/png',
      transparent: 'true',
      info_format: 'application/json',
      feature_count: 20,
      x: x,
      y: y
    };

    const qs = Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');

    const url = IDE_V62_WMS_URL + '?' + qs;
    const resp = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true,
      followRedirects: true
    });

    const status = resp.getResponseCode();
    const txt = resp.getContentText();

    if (status < 200 || status >= 300) {
      return { ok:false, erro:'IDE-Sisema respondeu HTTP ' + status, bruto:txt.slice(0,2000) };
    }

    try {
      const obj = JSON.parse(txt);
      const feats = (obj && obj.features) ? obj.features : [];
      return {
        ok:true,
        total:feats.length,
        features:feats.map(f => ({
          id: f.id || '',
          geometryType: f.geometry ? f.geometry.type : '',
          properties: f.properties || {}
        }))
      };
    } catch(jsonErr) {
      return {
        ok:false,
        erro:'A camada não retornou atributos em JSON.',
        bruto:txt.slice(0,4000)
      };
    }
  } catch(e) {
    return { ok:false, erro:String(e && e.message ? e.message : e) };
  }
}


/* V6.2.5 — tolerância a indisponibilidade transitória do GeoServer.
   Tenta novamente algumas vezes antes de devolver erro ao painel. */
function fetchIDEComRetryV625_(url) {
  let ultimoErro = null;
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      return UrlFetchApp.fetch(url, {
        method: 'get',
        muteHttpExceptions: true,
        followRedirects: true,
        headers: { 'User-Agent': 'Mozilla/5.0 GoogleAppsScript IDE-Sisema' }
      });
    } catch (e) {
      ultimoErro = e;
      if (tentativa < 3) Utilities.sleep(700 * tentativa);
    }
  }
  throw ultimoErro || new Error('Serviço IDE-Sisema temporariamente indisponível.');
}


/**
 * V7.0.3 - Transporte resiliente para o GeoServer público do SICAR.
 *
 * Estratégia:
 * 1) tenta HTTPS com validação normal de certificado;
 * 2) somente se a conexão lançar exceção, repete exclusivamente para
 *    geoserver.car.gov.br com validateHttpsCertificates:false.
 *
 * A flexibilização NÃO é aplicada a outros serviços externos do mapa.
 */
function _sicarEhUrlOficial_(url) {
  return /^https:\/\/geoserver\.car\.gov\.br\//i.test(String(url || ''));
}

var SICAR_V703_ULTIMO_TRANSPORTE_ = 'normal';

function _sicarOpcoesFetch_(opcoes, ignorarCertificado) {
  var o = {};
  Object.keys(opcoes || {}).forEach(function(k) { o[k] = opcoes[k]; });
  if (ignorarCertificado) o.validateHttpsCertificates = false;
  return o;
}

function fetchSicarResilienteV703_(url, opcoes) {
  opcoes = opcoes || {};
  try {
    SICAR_V703_ULTIMO_TRANSPORTE_ = 'normal';
    return UrlFetchApp.fetch(url, _sicarOpcoesFetch_(opcoes, false));
  } catch (erroNormal) {
    if (!_sicarEhUrlOficial_(url)) throw erroNormal;
    try {
      SICAR_V703_ULTIMO_TRANSPORTE_ = 'fallback_ssl';
      return UrlFetchApp.fetch(url, _sicarOpcoesFetch_(opcoes, true));
    } catch (erroFallback) {
      var a = erroNormal && erroNormal.message ? erroNormal.message : String(erroNormal || '');
      var b = erroFallback && erroFallback.message ? erroFallback.message : String(erroFallback || '');
      throw new Error('SICAR indisponível. HTTPS normal: ' + a + ' | fallback de certificado: ' + b);
    }
  }
}

function fetchAllSicarResilienteV703_(requisicoes) {
  requisicoes = Array.isArray(requisicoes) ? requisicoes : [];
  if (!requisicoes.length) return [];

  try {
    return UrlFetchApp.fetchAll(requisicoes);
  } catch (erroNormal) {
    var podeFallback = requisicoes.every(function(r) {
      return r && _sicarEhUrlOficial_(r.url);
    });
    if (!podeFallback) throw erroNormal;

    var fallback = requisicoes.map(function(r) {
      var copia = {};
      Object.keys(r || {}).forEach(function(k) { copia[k] = r[k]; });
      copia.validateHttpsCertificates = false;
      return copia;
    });

    try {
      return UrlFetchApp.fetchAll(fallback);
    } catch (erroFallback) {
      var a = erroNormal && erroNormal.message ? erroNormal.message : String(erroNormal || '');
      var b = erroFallback && erroFallback.message ? erroFallback.message : String(erroFallback || '');
      throw new Error('SICAR indisponível na consulta em lote. HTTPS normal: ' + a + ' | fallback de certificado: ' + b);
    }
  }
}

/**
 * V6.5.0 - Consulta pontual ao CAR/SICAR pelo GeoServer público.
 */
function consultarCarPorCoordenada(lat, lon, uf) {
  lat = Number(lat);
  lon = Number(lon);
  uf = String(uf || 'MG').trim().toUpperCase();

  if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return { ok: false, erro: 'Coordenada inválida.' };
  }

  var ufs = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];
  if (ufs.indexOf(uf) < 0) return { ok: false, erro: 'UF inválida.' };

  var layer = 'sicar:sicar_imoveis_' + uf.toLowerCase();
  var cql = 'INTERSECTS(geo_area_imovel, POINT(' + lon.toFixed(8) + ' ' + lat.toFixed(8) + '))';
  var base = 'https://geoserver.car.gov.br/geoserver/sicar/ows';
  var url = base
    + '?service=WFS'
    + '&version=1.0.0'
    + '&request=GetFeature'
    + '&typeName=' + encodeURIComponent(layer)
    + '&outputFormat=' + encodeURIComponent('application/json')
    + '&srsName=' + encodeURIComponent('EPSG:4326')
    + '&maxFeatures=25'
    + '&cql_filter=' + encodeURIComponent(cql);

  try {
    var resp = fetchSicarResilienteV703_(url, {
      method: 'get',
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { 'Accept': 'application/json', 'User-Agent': 'PMMG-Mapa-Demandas/6.5' }
    });

    var status = resp.getResponseCode();
    if (status < 200 || status >= 300) {
      return { ok: false, erro: 'SICAR respondeu HTTP ' + status + '. Tente novamente em alguns instantes.' };
    }

    var obj = JSON.parse(resp.getContentText('UTF-8'));
    var features = Array.isArray(obj.features) ? obj.features : [];
    return { ok: true, uf: uf, lat: lat, lon: lon, quantidade: features.length, features: features, transporteSicar: SICAR_V703_ULTIMO_TRANSPORTE_ };
  } catch (e) {
    return { ok: false, erro: 'Falha na comunicação com o GeoServer do SICAR: ' + (e && e.message ? e.message : e) };
  }
}

/**
 * V6.6.8 - Consulta o CAR/SICAR de várias demandas de uma só vez.
 * Retorna os números de CAR encontrados para cada coordenada.
 */
function consultarCarsPorDemandas(demandas, uf) {
  uf = String(uf || 'MG').trim().toUpperCase();
  if (!Array.isArray(demandas) || !demandas.length) {
    return { ok: true, resultados: [] };
  }

  var ufs = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];
  if (ufs.indexOf(uf) < 0) return { ok: false, erro: 'UF inválida.', resultados: [] };

  // Limite defensivo por chamada. O navegador divide lotes maiores.
  demandas = demandas.slice(0, 80);

  var layer = 'sicar:sicar_imoveis_' + uf.toLowerCase();
  var base = 'https://geoserver.car.gov.br/geoserver/sicar/ows';

  var preparados = demandas.map(function(d, i) {
    var lat = Number(d && d.lat);
    var lon = Number(d && d.lon);
    var chave = String((d && d.chave) || i);

    if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return { chave: chave, invalido: true };
    }

    var cql = 'INTERSECTS(geo_area_imovel, POINT(' + lon.toFixed(8) + ' ' + lat.toFixed(8) + '))';
    var url = base
      + '?service=WFS'
      + '&version=1.0.0'
      + '&request=GetFeature'
      + '&typeName=' + encodeURIComponent(layer)
      + '&outputFormat=' + encodeURIComponent('application/json')
      + '&srsName=' + encodeURIComponent('EPSG:4326')
      + '&maxFeatures=25'
      + '&propertyName=' + encodeURIComponent('cod_imovel,municipio,area,status_imovel,condicao')
      + '&cql_filter=' + encodeURIComponent(cql);

    return {
      chave: chave,
      lat: lat,
      lon: lon,
      request: {
        url: url,
        method: 'get',
        muteHttpExceptions: true,
        followRedirects: true,
        headers: { 'Accept': 'application/json', 'User-Agent': 'PMMG-Mapa-Demandas/6.6.8' }
      }
    };
  });

  var validos = preparados.filter(function(x) { return !x.invalido; });
  var respostas = [];
  try {
    if (validos.length) respostas = fetchAllSicarResilienteV703_(validos.map(function(x) { return x.request; }));
  } catch (e) {
    return { ok: false, erro: 'Falha na consulta em lote ao SICAR: ' + (e && e.message ? e.message : e), resultados: [] };
  }

  var porChave = {};
  preparados.filter(function(x) { return x.invalido; }).forEach(function(x) {
    porChave[x.chave] = { chave: x.chave, ok: false, cars: [], erro: 'Coordenada inválida.' };
  });

  validos.forEach(function(x, i) {
    try {
      var resp = respostas[i];
      var status = resp.getResponseCode();
      if (status < 200 || status >= 300) {
        porChave[x.chave] = { chave: x.chave, ok: false, cars: [], erro: 'SICAR HTTP ' + status };
        return;
      }

      var obj = JSON.parse(resp.getContentText('UTF-8'));
      var feats = Array.isArray(obj.features) ? obj.features : [];
      var cars = [];
      feats.forEach(function(f) {
        var p = (f && f.properties) || {};
        var cod = String(p.cod_imovel || '').trim();
        if (cod && cars.indexOf(cod) < 0) cars.push(cod);
      });

      porChave[x.chave] = {
        chave: x.chave,
        ok: true,
        cars: cars,
        car: cars.join(' / '),
        quantidade: cars.length
      };
    } catch (e) {
      porChave[x.chave] = { chave: x.chave, ok: false, cars: [], erro: String(e && e.message ? e.message : e) };
    }
  });

  return {
    ok: true,
    resultados: preparados.map(function(x) {
      return porChave[x.chave] || { chave: x.chave, ok: false, cars: [], erro: 'Sem resposta.' };
    })
  };
}

/**
 * V6.6.9 - Gera arquivos DOCX nativos (OOXML) para:
 * - relatório de uma operação;
 * - pacote operacional;
 * - planejamento das operações.
 *
 * O arquivo é montado no Apps Script e devolvido em Base64 ao navegador.
 */
function gerarDocxOperacional(payload) {
  try {
    payload = payload || {};
    var tipo = String(payload.tipo || '').toUpperCase();
    if (['OPERACAO', 'PACOTE', 'PLANEJAMENTO'].indexOf(tipo) < 0) {
      throw new Error('Tipo de relatório DOCX inválido.');
    }

    var corpo = [];

    function escXml_(v) {
      return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }

    function run_(texto, bold, size) {
      texto = texto == null ? '' : String(texto);
      var rPr = '';
      if (bold) rPr += '<w:b/>';
      if (size) rPr += '<w:sz w:val="' + Number(size) + '"/><w:szCs w:val="' + Number(size) + '"/>';
      return '<w:r>' + (rPr ? '<w:rPr>' + rPr + '</w:rPr>' : '') +
        '<w:t xml:space="preserve">' + escXml_(texto) + '</w:t></w:r>';
    }

    function p_(texto, opts) {
      opts = opts || {};
      var pPr = '';
      if (opts.align) pPr += '<w:jc w:val="' + opts.align + '"/>';
      if (opts.after != null) pPr += '<w:spacing w:after="' + Number(opts.after) + '"/>';
      if (opts.before != null) pPr += '<w:spacing w:before="' + Number(opts.before) + '"/>';
      if (opts.keepNext) pPr += '<w:keepNext/>';
      return '<w:p>' + (pPr ? '<w:pPr>' + pPr + '</w:pPr>' : '') +
        run_(texto, !!opts.bold, opts.size || 22) + '</w:p>';
    }

    function cell_(texto, bold, width) {
      var tcPr = width ? '<w:tcPr><w:tcW w:w="' + Number(width) + '" w:type="dxa"/></w:tcPr>' : '';
      return '<w:tc>' + tcPr + p_(texto, {bold: bold, size: 18, after: 0}) + '</w:tc>';
    }

    function table_(headers, rows, widths) {
      var xml = '<w:tbl>' +
        '<w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="0" w:type="auto"/>' +
        '<w:tblBorders>' +
          '<w:top w:val="single" w:sz="4" w:color="B7C3D0"/>' +
          '<w:left w:val="single" w:sz="4" w:color="B7C3D0"/>' +
          '<w:bottom w:val="single" w:sz="4" w:color="B7C3D0"/>' +
          '<w:right w:val="single" w:sz="4" w:color="B7C3D0"/>' +
          '<w:insideH w:val="single" w:sz="4" w:color="D7DEE7"/>' +
          '<w:insideV w:val="single" w:sz="4" w:color="D7DEE7"/>' +
        '</w:tblBorders></w:tblPr>';
      xml += '<w:tr>' + headers.map(function(h, i) {
        return cell_(h, true, widths && widths[i]);
      }).join('') + '</w:tr>';
      rows.forEach(function(r) {
        xml += '<w:tr>' + r.map(function(c, i) {
          return cell_(c, false, widths && widths[i]);
        }).join('') + '</w:tr>';
      });
      xml += '</w:tbl>';
      return xml;
    }

    function sectionTitle_(t) {
      corpo.push(p_(t, {bold:true, size:24, before:180, after:80, keepNext:true}));
    }

    function campo_(rotulo, valor) {
      valor = String(valor == null ? '' : valor).trim();
      if (!valor) return;
      corpo.push('<w:p><w:pPr><w:spacing w:after="40"/></w:pPr>' +
        run_(rotulo + ': ', true, 20) + run_(valor, false, 20) + '</w:p>');
    }

    function demandasTable_(demandas) {
      demandas = Array.isArray(demandas) ? demandas : [];
      var rows = demandas.map(function(d, i) {
        return [
          String(d.ordem || (i + 1)),
          String(d.codigo || ''),
          String(d.tipo || ''),
          String(d.municipio || ''),
          String(d.natureza || ''),
          String(d.car || 'Não identificado'),
          String(d.coordenadas || '')
        ];
      });
      corpo.push(table_(
        ['#','Código','Tipo','Município','Natureza','CAR','Coordenadas'],
        rows,
        [450,1100,1450,1450,1450,2600,1450]
      ));
    }

    // Cabeçalho principal.
    corpo.push(p_(payload.titulo || 'RELATÓRIO OPERACIONAL', {bold:true, size:32, align:'center', after:80}));
    corpo.push(p_('1º GP / 5º Pel PM MAmb', {bold:true, size:20, align:'center', after:160}));
    corpo.push(p_('Gerado em ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm'), {size:18, align:'center', after:220}));

    if (tipo === 'OPERACAO' || tipo === 'PACOTE') {
      var op = payload.operacao || {};
      sectionTitle_('Dados da operação');
      campo_('Operação', op.nome);
      campo_('Situação', op.status);
      campo_('Área de atuação', op.area);
      campo_('Período previsto', op.periodo);
      campo_('Jornada prevista', op.jornada);
      campo_('Equipe', op.equipe);
      campo_('Viatura', op.viatura);
      campo_('Comandante', op.comandante);
      campo_('Demandas originais', op.totalOriginais);
      campo_('Demandas selecionadas', op.totalSelecionadas);

      if (String(op.observacoes || '').trim()) {
        sectionTitle_('Orientações / observações');
        corpo.push(p_(op.observacoes, {size:20, after:120}));
      }

      sectionTitle_(tipo === 'PACOTE' ? 'Demandas selecionadas' : 'Demandas da operação');
      demandasTable_(payload.demandas || []);
    }

    if (tipo === 'PLANEJAMENTO') {
      var resumo = payload.resumo || {};
      sectionTitle_('Resumo geral');
      campo_('Equipes / operações', resumo.equipes);
      campo_('Demandas nos setores', resumo.totalDemandas);
      campo_('Demandas planejadas', resumo.totalPlanejadas);
      campo_('Demandas não alocadas', resumo.totalPendentes);

      (payload.equipes || []).forEach(function(eq) {
        sectionTitle_('Equipe ' + eq.equipe + ' — ' + (eq.nome || 'Operação'));
        campo_('Período', String(eq.inicio || '') + (eq.fim ? ' a ' + eq.fim : ''));
        campo_('Jornada', eq.horasDia ? eq.horasDia + ' h/dia' : '');
        campo_('Dias disponíveis', eq.diasDisponiveis);
        campo_('Demandas do setor', eq.totalDemandas);
        campo_('Demandas planejadas', eq.planejadas);
        campo_('Não alocadas', (eq.pendentes || []).length);

        (eq.jornadas || []).forEach(function(j) {
          corpo.push(p_('Dia ' + j.dia + ' — ' + (j.data || '') + ' — ' + (j.tempo || ''), {
            bold:true, size:21, before:120, after:50, keepNext:true
          }));
          demandasTable_(j.demandas || []);
        });

        if ((eq.pendentes || []).length) {
          corpo.push(p_('Demandas não alocadas', {bold:true, size:21, before:120, after:50, keepNext:true}));
          demandasTable_(eq.pendentes || []);
        }
      });
    }

    // Seção final: margens A4.
    corpo.push(
      '<w:sectPr>' +
        '<w:pgSz w:w="11906" w:h="16838"/>' +
        '<w:pgMar w:top="1134" w:right="850" w:bottom="1134" w:left="850" w:header="708" w:footer="708" w:gutter="0"/>' +
      '</w:sectPr>'
    );

    var documentXml =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:body>' + corpo.join('') + '</w:body></w:document>';

    var stylesXml =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
        '<w:style w:type="paragraph" w:default="1" w:styleId="Normal">' +
          '<w:name w:val="Normal"/><w:qFormat/>' +
          '<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>' +
        '</w:style>' +
        '<w:style w:type="table" w:styleId="TableGrid">' +
          '<w:name w:val="Table Grid"/><w:tblPr><w:tblBorders>' +
            '<w:top w:val="single" w:sz="4" w:color="B7C3D0"/>' +
            '<w:left w:val="single" w:sz="4" w:color="B7C3D0"/>' +
            '<w:bottom w:val="single" w:sz="4" w:color="B7C3D0"/>' +
            '<w:right w:val="single" w:sz="4" w:color="B7C3D0"/>' +
            '<w:insideH w:val="single" w:sz="4" w:color="D7DEE7"/>' +
            '<w:insideV w:val="single" w:sz="4" w:color="D7DEE7"/>' +
          '</w:tblBorders></w:tblPr>' +
        '</w:style>' +
      '</w:styles>';

    var contentTypes =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
      '</Types>';

    var rootRels =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '</Relationships>';

    var docRels =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>';

    var blobs = [
      Utilities.newBlob(contentTypes, 'application/xml', '[Content_Types].xml'),
      Utilities.newBlob(rootRels, 'application/xml', '_rels/.rels'),
      Utilities.newBlob(documentXml, 'application/xml', 'word/document.xml'),
      Utilities.newBlob(stylesXml, 'application/xml', 'word/styles.xml'),
      Utilities.newBlob(docRels, 'application/xml', 'word/_rels/document.xml.rels')
    ];

    var nome = String(payload.nomeArquivo || 'relatorio_operacional.docx');
    if (!/\.docx$/i.test(nome)) nome += '.docx';
    nome = nome.replace(/[\\/:*?"<>|]+/g, '_');

    var zip = Utilities.zip(blobs, nome).setContentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    return {
      ok: true,
      nomeArquivo: nome,
      base64: Utilities.base64Encode(zip.getBytes())
    };
  } catch (e) {
    return {
      ok: false,
      erro: String(e && e.message ? e.message : e)
    };
  }
}

/**
 * V6.7.0 - Gera PDF para os mesmos relatórios usados no DOCX.
 * A saída é criada no servidor e enviada ao navegador em Base64.
 */
function gerarPdfOperacional(payload) {
  try {
    payload = payload || {};
    var tipo = String(payload.tipo || '').toUpperCase();
    if (['OPERACAO', 'PACOTE', 'PLANEJAMENTO'].indexOf(tipo) < 0) {
      throw new Error('Tipo de relatório PDF inválido.');
    }

    function esc(v) {
      return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function linha(rotulo, valor) {
      valor = String(valor == null ? '' : valor).trim();
      if (!valor) return '';
      return '<div class="campo"><b>' + esc(rotulo) + ':</b> ' + esc(valor) + '</div>';
    }

    function tabelaDemandas(demandas) {
      demandas = Array.isArray(demandas) ? demandas : [];
      var trs = demandas.map(function(d, i) {
        return '<tr>' +
          '<td>' + esc(d.ordem || (i + 1)) + '</td>' +
          '<td>' + esc(d.codigo || '') + '</td>' +
          '<td>' + esc(d.tipo || '') + '</td>' +
          '<td>' + esc(d.municipio || '') + '</td>' +
          '<td>' + esc(d.natureza || '') + '</td>' +
          '<td class="car">' + esc(d.car || 'Não identificado') + '</td>' +
          '<td>' + esc(d.coordenadas || '') + '</td>' +
        '</tr>';
      }).join('');
      return '<table><thead><tr>' +
        '<th>#</th><th>Código</th><th>Tipo</th><th>Município</th><th>Natureza</th><th>CAR</th><th>Coordenadas</th>' +
        '</tr></thead><tbody>' + trs + '</tbody></table>';
    }

    var partes = [];
    partes.push('<h1>' + esc(payload.titulo || 'RELATÓRIO OPERACIONAL') + '</h1>');
    partes.push('<div class="sub">1º GP / 5º Pel PM MAmb</div>');
    partes.push('<div class="gerado">Gerado em ' +
      Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm') +
      '</div>');

    if (tipo === 'OPERACAO' || tipo === 'PACOTE') {
      var op = payload.operacao || {};
      partes.push('<h2>Dados da operação</h2>');
      partes.push(linha('Operação', op.nome));
      partes.push(linha('Situação', op.status));
      partes.push(linha('Área de atuação', op.area));
      partes.push(linha('Período previsto', op.periodo));
      partes.push(linha('Jornada prevista', op.jornada));
      partes.push(linha('Equipe', op.equipe));
      partes.push(linha('Viatura', op.viatura));
      partes.push(linha('Comandante', op.comandante));
      partes.push(linha('Demandas originais', op.totalOriginais));
      partes.push(linha('Demandas selecionadas', op.totalSelecionadas));
      if (String(op.observacoes || '').trim()) {
        partes.push('<h2>Orientações / observações</h2><div class="obs">' + esc(op.observacoes) + '</div>');
      }
      partes.push('<h2>' + (tipo === 'PACOTE' ? 'Demandas selecionadas' : 'Demandas da operação') + '</h2>');
      partes.push(tabelaDemandas(payload.demandas || []));
    }

    if (tipo === 'PLANEJAMENTO') {
      var resumo = payload.resumo || {};
      partes.push('<h2>Resumo geral</h2>');
      partes.push(linha('Equipes / operações', resumo.equipes));
      partes.push(linha('Demandas nos setores', resumo.totalDemandas));
      partes.push(linha('Demandas planejadas', resumo.totalPlanejadas));
      partes.push(linha('Demandas não alocadas', resumo.totalPendentes));

      (payload.equipes || []).forEach(function(eq) {
        partes.push('<div class="quebra"></div>');
        partes.push('<h2>Equipe ' + esc(eq.equipe) + ' — ' + esc(eq.nome || 'Operação') + '</h2>');
        partes.push(linha('Período', String(eq.inicio || '') + (eq.fim ? ' a ' + eq.fim : '')));
        partes.push(linha('Jornada', eq.horasDia ? eq.horasDia + ' h/dia' : ''));
        partes.push(linha('Dias disponíveis', eq.diasDisponiveis));
        partes.push(linha('Demandas do setor', eq.totalDemandas));
        partes.push(linha('Demandas planejadas', eq.planejadas));
        partes.push(linha('Não alocadas', (eq.pendentes || []).length));

        (eq.jornadas || []).forEach(function(j) {
          partes.push('<h3>Dia ' + esc(j.dia) + ' — ' + esc(j.data || '') + ' — ' + esc(j.tempo || '') + '</h3>');
          partes.push(tabelaDemandas(j.demandas || []));
        });

        if ((eq.pendentes || []).length) {
          partes.push('<h3>Demandas não alocadas</h3>');
          partes.push(tabelaDemandas(eq.pendentes || []));
        }
      });
    }

    var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      '@page{size:A4 landscape;margin:12mm 10mm}' +
      'body{font-family:Arial,sans-serif;color:#172033;font-size:9pt;line-height:1.3}' +
      'h1{text-align:center;font-size:18pt;margin:0 0 2mm}' +
      '.sub{text-align:center;font-weight:700;font-size:10pt}' +
      '.gerado{text-align:center;color:#64748b;font-size:8pt;margin:1mm 0 5mm}' +
      'h2{font-size:13pt;margin:5mm 0 2mm;border-bottom:1px solid #cbd5e1;padding-bottom:1mm}' +
      'h3{font-size:10.5pt;margin:4mm 0 1.5mm}' +
      '.campo{margin:1mm 0}.obs{white-space:pre-wrap;border:1px solid #cbd5e1;padding:2mm;border-radius:2mm}' +
      'table{width:100%;border-collapse:collapse;table-layout:fixed;margin:1.5mm 0 4mm}' +
      'th,td{border:1px solid #b7c3d0;padding:1.2mm 1mm;vertical-align:top;word-wrap:break-word;overflow-wrap:anywhere}' +
      'th{background:#eef2f7;font-weight:700;font-size:7.6pt}' +
      'td{font-size:7.3pt}.car{font-size:6.8pt}' +
      'th:nth-child(1),td:nth-child(1){width:4%}' +
      'th:nth-child(2),td:nth-child(2){width:11%}' +
      'th:nth-child(3),td:nth-child(3){width:13%}' +
      'th:nth-child(4),td:nth-child(4){width:16%}' +
      'th:nth-child(5),td:nth-child(5){width:14%}' +
      'th:nth-child(6),td:nth-child(6){width:27%}' +
      'th:nth-child(7),td:nth-child(7){width:15%}' +
      '.quebra{page-break-before:always}' +
      '</style></head><body>' + partes.join('') + '</body></html>';

    var nome = String(payload.nomeArquivo || 'relatorio_operacional.pdf');
    if (!/\.pdf$/i.test(nome)) nome += '.pdf';
    nome = nome.replace(/[\\/:*?"<>|]+/g, '_');

    var htmlBlob = Utilities.newBlob(html, 'text/html', 'relatorio.html');
    var pdfBlob;
    try {
      pdfBlob = htmlBlob.getAs(MimeType.PDF).setName(nome);
    } catch (e1) {
      // Fallback completo por Google Docs caso a conversão direta de HTML não esteja disponível.
      var doc = DocumentApp.create('TEMP_PDF_' + new Date().getTime());
      var body = doc.getBody();
      try {
        body.setPageWidth(842).setPageHeight(595); // A4 paisagem em pontos
        body.setMarginTop(28).setMarginBottom(28).setMarginLeft(24).setMarginRight(24);
      } catch (ePage) {}

      function addTitle_(txt) {
        var p = body.appendParagraph(String(txt || ''));
        p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        p.editAsText().setBold(true).setFontSize(16);
      }
      function addSub_(txt) {
        var p = body.appendParagraph(String(txt || ''));
        p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        p.editAsText().setBold(true).setFontSize(10);
      }
      function addH2_(txt) {
        var p = body.appendParagraph(String(txt || ''));
        p.setSpacingBefore(10).setSpacingAfter(4);
        p.editAsText().setBold(true).setFontSize(12);
      }
      function addField_(rotulo, valor) {
        valor = String(valor == null ? '' : valor).trim();
        if (!valor) return;
        var p = body.appendParagraph(String(rotulo) + ': ' + valor);
        var t = p.editAsText();
        t.setFontSize(9);
        if (String(rotulo).length) t.setBold(0, String(rotulo).length, true);
      }
      function addDemandasTable_(dems) {
        dems = Array.isArray(dems) ? dems : [];
        var rows = [['#','Código','Tipo','Município','Natureza','CAR','Coordenadas']];
        dems.forEach(function(d, i) {
          rows.push([
            String(d.ordem || (i + 1)),
            String(d.codigo || ''),
            String(d.tipo || ''),
            String(d.municipio || ''),
            String(d.natureza || ''),
            String(d.car || 'Não identificado'),
            String(d.coordenadas || '')
          ]);
        });
        var tbl = body.appendTable(rows);
        try {
          tbl.setBorderColor('#B7C3D0').setBorderWidth(0.5);
          for (var rr = 0; rr < tbl.getNumRows(); rr++) {
            var row = tbl.getRow(rr);
            for (var cc = 0; cc < row.getNumCells(); cc++) {
              var cell = row.getCell(cc);
              cell.setPaddingTop(2).setPaddingBottom(2).setPaddingLeft(2).setPaddingRight(2);
              var text = cell.editAsText();
              text.setFontSize(rr === 0 ? 7 : 6.5);
              if (rr === 0) text.setBold(true);
            }
          }
        } catch (eTable) {}
      }

      addTitle_(payload.titulo || 'RELATÓRIO OPERACIONAL');
      addSub_('1º GP / 5º Pel PM MAmb');
      var pg = body.appendParagraph('Gerado em ' +
        Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm'));
      pg.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      pg.editAsText().setFontSize(8).setForegroundColor('#64748B');

      if (tipo === 'OPERACAO' || tipo === 'PACOTE') {
        var op2 = payload.operacao || {};
        addH2_('Dados da operação');
        addField_('Operação', op2.nome);
        addField_('Situação', op2.status);
        addField_('Área de atuação', op2.area);
        addField_('Período previsto', op2.periodo);
        addField_('Jornada prevista', op2.jornada);
        addField_('Equipe', op2.equipe);
        addField_('Viatura', op2.viatura);
        addField_('Comandante', op2.comandante);
        addField_('Demandas originais', op2.totalOriginais);
        addField_('Demandas selecionadas', op2.totalSelecionadas);
        if (String(op2.observacoes || '').trim()) {
          addH2_('Orientações / observações');
          body.appendParagraph(String(op2.observacoes)).editAsText().setFontSize(9);
        }
        addH2_(tipo === 'PACOTE' ? 'Demandas selecionadas' : 'Demandas da operação');
        addDemandasTable_(payload.demandas || []);
      }

      if (tipo === 'PLANEJAMENTO') {
        var rs = payload.resumo || {};
        addH2_('Resumo geral');
        addField_('Equipes / operações', rs.equipes);
        addField_('Demandas nos setores', rs.totalDemandas);
        addField_('Demandas planejadas', rs.totalPlanejadas);
        addField_('Demandas não alocadas', rs.totalPendentes);

        (payload.equipes || []).forEach(function(eq2, idxEq) {
          if (idxEq > 0) body.appendPageBreak();
          addH2_('Equipe ' + eq2.equipe + ' — ' + (eq2.nome || 'Operação'));
          addField_('Período', String(eq2.inicio || '') + (eq2.fim ? ' a ' + eq2.fim : ''));
          addField_('Jornada', eq2.horasDia ? eq2.horasDia + ' h/dia' : '');
          addField_('Dias disponíveis', eq2.diasDisponiveis);
          addField_('Demandas do setor', eq2.totalDemandas);
          addField_('Demandas planejadas', eq2.planejadas);
          addField_('Não alocadas', (eq2.pendentes || []).length);

          (eq2.jornadas || []).forEach(function(j2) {
            addH2_('Dia ' + j2.dia + ' — ' + (j2.data || '') + ' — ' + (j2.tempo || ''));
            addDemandasTable_(j2.demandas || []);
          });

          if ((eq2.pendentes || []).length) {
            addH2_('Demandas não alocadas');
            addDemandasTable_(eq2.pendentes || []);
          }
        });
      }

      doc.saveAndClose();
      var file = DriveApp.getFileById(doc.getId());
      pdfBlob = file.getAs(MimeType.PDF).setName(nome);
      file.setTrashed(true);
    }

    return {
      ok: true,
      nomeArquivo: nome,
      base64: Utilities.base64Encode(pdfBlob.getBytes())
    };
  } catch (e) {
    return { ok: false, erro: String(e && e.message ? e.message : e) };
  }
}


/* =====================================================================
 * V6.9.0 — PLANEJAMENTO COMPARTILHADO / EDIÇÃO COLABORATIVA
 * Armazena o estado compartilhado em uma aba oculta da planilha central.
 * O JSON é dividido em blocos para respeitar o limite de caracteres por célula.
 * ===================================================================== */

const ABA_PLANEJAMENTO_COMPARTILHADO = '_PLANEJAMENTO_COMPARTILHADO';
const TAM_BLOCO_COMPARTILHAMENTO = 45000;

function _getAbaPlanejamentoCompartilhado_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA_PLANEJAMENTO_COMPARTILHADO);
  if (!sh) {
    sh = ss.insertSheet(ABA_PLANEJAMENTO_COMPARTILHADO);
    sh.getRange(1, 1, 1, 7).setValues([[
      'CODIGO', 'REVISAO', 'ATUALIZADO_EM', 'EDITOR', 'BLOCO', 'TOTAL_BLOCOS', 'JSON'
    ]]);
    sh.setFrozenRows(1);
    try { sh.hideSheet(); } catch (e) {}
  }
  return sh;
}

function _normalizarCodigoCompartilhamento_(codigo) {
  return String(codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
}

function _gerarCodigoCompartilhamento_() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 10; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

function _lerRegistroCompartilhado_(codigo) {
  codigo = _normalizarCodigoCompartilhamento_(codigo);
  if (!codigo) return null;

  const sh = _getAbaPlanejamentoCompartilhado_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return null;

  const vals = sh.getRange(2, 1, lastRow - 1, 7).getValues();
  const linhas = [];
  vals.forEach((r, i) => {
    if (_normalizarCodigoCompartilhamento_(r[0]) === codigo) {
      linhas.push({
        row: i + 2,
        codigo: codigo,
        revisao: Number(r[1]) || 0,
        atualizadoEm: r[2] instanceof Date ? r[2] : new Date(r[2]),
        editor: String(r[3] || ''),
        bloco: Number(r[4]) || 1,
        total: Number(r[5]) || 1,
        json: String(r[6] || '')
      });
    }
  });
  if (!linhas.length) return null;

  linhas.sort((a, b) => a.bloco - b.bloco);
  const revisao = Math.max.apply(null, linhas.map(x => x.revisao));
  const mesmas = linhas.filter(x => x.revisao === revisao).sort((a, b) => a.bloco - b.bloco);
  const json = mesmas.map(x => x.json).join('');
  const ultimo = mesmas[mesmas.length - 1];

  return {
    codigo: codigo,
    revisao: revisao,
    atualizadoEm: ultimo && ultimo.atualizadoEm ? ultimo.atualizadoEm : new Date(),
    editor: ultimo ? ultimo.editor : '',
    json: json,
    rows: linhas.map(x => x.row)
  };
}

function _gravarRegistroCompartilhado_(codigo, revisao, editor, json) {
  const sh = _getAbaPlanejamentoCompartilhado_();
  codigo = _normalizarCodigoCompartilhamento_(codigo);
  json = String(json || '');

  const existente = _lerRegistroCompartilhado_(codigo);
  if (existente && existente.rows && existente.rows.length) {
    existente.rows.slice().sort((a, b) => b - a).forEach(r => sh.deleteRow(r));
  }

  const blocos = [];
  for (let i = 0; i < json.length; i += TAM_BLOCO_COMPARTILHAMENTO) {
    blocos.push(json.slice(i, i + TAM_BLOCO_COMPARTILHAMENTO));
  }
  if (!blocos.length) blocos.push('{}');

  const agora = new Date();
  const rows = blocos.map((b, i) => [
    codigo, revisao, agora, String(editor || ''), i + 1, blocos.length, b
  ]);
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, 7).setValues(rows);
  SpreadsheetApp.flush();
}

function criarPlanejamentoCompartilhado(payload) {
  payload = payload || {};
  const json = String(payload.estadoJson || '');
  if (!json) throw new Error('Estado do planejamento não informado.');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    let codigo = '';
    for (let t = 0; t < 20; t++) {
      const c = _gerarCodigoCompartilhamento_();
      if (!_lerRegistroCompartilhado_(c)) { codigo = c; break; }
    }
    if (!codigo) throw new Error('Não foi possível gerar um código de compartilhamento.');

    _gravarRegistroCompartilhado_(codigo, 1, payload.editor || '', json);
    const base = ScriptApp.getService().getUrl() || '';
    return {
      ok: true,
      codigo: codigo,
      revisao: 1,
      link: base ? base + '?plano=' + encodeURIComponent(codigo) : '',
      atualizadoEm: new Date().toISOString()
    };
  } finally {
    lock.releaseLock();
  }
}

function obterPlanejamentoCompartilhado(codigo) {
  const reg = _lerRegistroCompartilhado_(codigo);
  if (!reg) return { ok: false, encontrado: false, mensagem: 'Planejamento compartilhado não encontrado.' };

  return {
    ok: true,
    encontrado: true,
    codigo: reg.codigo,
    revisao: reg.revisao,
    editor: reg.editor,
    atualizadoEm: reg.atualizadoEm ? reg.atualizadoEm.toISOString() : '',
    estadoJson: reg.json
  };
}

function salvarPlanejamentoCompartilhado(payload) {
  payload = payload || {};
  const codigo = _normalizarCodigoCompartilhamento_(payload.codigo);
  const json = String(payload.estadoJson || '');
  const esperada = Number(payload.revisao || 0);
  const forcar = Boolean(payload.forcar);

  if (!codigo) throw new Error('Código de compartilhamento inválido.');
  if (!json) throw new Error('Estado do planejamento não informado.');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const atual = _lerRegistroCompartilhado_(codigo);
    if (!atual) return { ok: false, encontrado: false, mensagem: 'Planejamento compartilhado não encontrado.' };

    if (!forcar && esperada !== atual.revisao) {
      return {
        ok: false,
        conflito: true,
        codigo: codigo,
        revisao: atual.revisao,
        editor: atual.editor,
        atualizadoEm: atual.atualizadoEm ? atual.atualizadoEm.toISOString() : '',
        estadoJson: atual.json
      };
    }

    const novaRev = atual.revisao + 1;
    _gravarRegistroCompartilhado_(codigo, novaRev, payload.editor || '', json);
    return {
      ok: true,
      codigo: codigo,
      revisao: novaRev,
      atualizadoEm: new Date().toISOString()
    };
  } finally {
    lock.releaseLock();
  }
}


/* =====================================================================
 * V6.10.0 — CONSULTA SICAR POR NÚMERO DO CAR
 * Usa o GeoServer público do SICAR, já utilizado pela consulta por coordenada.
 * ===================================================================== */

function consultarCarPorCodigoPublico(codigoCar) {
  var car = String(codigoCar || '').trim().toUpperCase();
  var m = car.match(/^([A-Z]{2})-/);
  if (!m) return { ok: false, erro: 'Número do CAR inválido.' };

  var uf = m[1];
  var ufs = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];
  if (ufs.indexOf(uf) < 0) return { ok: false, erro: 'UF do CAR inválida.' };

  var layer = 'sicar:sicar_imoveis_' + uf.toLowerCase();
  var base = 'https://geoserver.car.gov.br/geoserver/sicar/ows';
  var cql = "cod_imovel='" + car.replace(/'/g, "''") + "'";
  var url = base
    + '?service=WFS'
    + '&version=1.0.0'
    + '&request=GetFeature'
    + '&typeName=' + encodeURIComponent(layer)
    + '&outputFormat=' + encodeURIComponent('application/json')
    + '&srsName=' + encodeURIComponent('EPSG:4326')
    + '&maxFeatures=5'
    + '&cql_filter=' + encodeURIComponent(cql);

  try {
    var resp = fetchSicarResilienteV703_(url, {
      method: 'get',
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { 'Accept': 'application/json', 'User-Agent': 'PMMG-Mapa-Demandas/6.10' }
    });

    var status = resp.getResponseCode();
    if (status < 200 || status >= 300) {
      return { ok: false, erro: 'SICAR respondeu HTTP ' + status + '.' };
    }

    var obj = JSON.parse(resp.getContentText('UTF-8'));
    var features = Array.isArray(obj.features) ? obj.features : [];
    if (!features.length) {
      return { ok: true, encontrado: false, car: car, uf: uf, features: [] };
    }

    return {
      ok: true,
      encontrado: true,
      car: car,
      uf: uf,
      features: features
    };
  } catch (e) {
    return { ok: false, erro: 'Falha na consulta ao SICAR: ' + (e && e.message ? e.message : e) };
  }
}


/* =====================================================================
 * V7.0.2 — DOWNLOAD ROBUSTO DO SHAPEFILE SICAR
 * Faz o download no servidor Apps Script e devolve o ZIP em Base64.
 * Evita bloqueio de popup/CORS do navegador.
 * ===================================================================== */

/* baixarShapefileCarPublico substituída pela V7.0.13 abaixo. */




/* =====================================================================
 * V7.0.5 — EXPORTAÇÃO DAS CAMADAS IDE-SISEMA VISÍVEIS PARA KML COMPLETO
 * Consulta, via WFS, as feições das camadas IDE ativas que estejam no
 * retângulo envolvente da área escolhida. O navegador faz o recorte final
 * pela área/polígono antes de montar o KML.
 * ===================================================================== */
const IDE_V704_WFS_URLS = [
  // Endpoint oficial atual da IDE-SISEMA.
  'https://geoserver.meioambiente.mg.gov.br/ows',
  // Mantidos como fallback para compatibilidade.
  'https://geoserver.meioambiente.mg.gov.br/wfs',
  'https://geoserver.meioambiente.mg.gov.br/geoserver/wfs'
];

function _ideV704Numero_(v) {
  v = Number(v);
  return isFinite(v) ? v : null;
}

function _ideV704FetchGeoJson_(layer, bbox, limite) {
  var ultimo = '';
  for (var i = 0; i < IDE_V704_WFS_URLS.length; i++) {
    var base = IDE_V704_WFS_URLS[i];
    var params = {
      service: 'WFS', version: '1.1.0', request: 'GetFeature',
      typeName: layer,
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      maxFeatures: limite,
      bbox: bbox.join(',') + ',EPSG:4326'
    };
    var qs = Object.keys(params).map(function(k){
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    var url = base + '?' + qs;
    try {
      var resp = null;
      var ultimoFetch = null;
      for (var tentativa = 1; tentativa <= 3; tentativa++) {
        try {
          resp = UrlFetchApp.fetch(url, {
            method:'get',
            muteHttpExceptions:true,
            followRedirects:true,
            headers:{
              'Accept':'application/json,application/geo+json,*/*',
              'User-Agent':'Mozilla/5.0 GoogleAppsScript IDE-Sisema KML/7.0.5'
            }
          });
          break;
        } catch(eFetch) {
          ultimoFetch = eFetch;
          if (tentativa < 3) Utilities.sleep(700 * tentativa);
        }
      }
      if (!resp) throw ultimoFetch || new Error('Falha de comunicação com a IDE-SISEMA.');
      var status = resp.getResponseCode();
      var txt = resp.getContentText('UTF-8');
      if (status < 200 || status >= 300) {
        ultimo = 'HTTP ' + status + ' em ' + base;
        continue;
      }
      try {
        var obj = JSON.parse(txt);
        if (obj && Array.isArray(obj.features)) return {ok:true, features:obj.features, endpoint:base, layer:layer, status:status};
        ultimo = 'Resposta WFS sem GeoJSON em ' + base;
      } catch (eJson) {
        ultimo = 'Resposta WFS não JSON em ' + base + ': ' + txt.slice(0,180);
      }
    } catch (e) {
      ultimo = String(e && e.message ? e.message : e);
    }
  }
  return {ok:false, erro:ultimo || 'WFS da IDE-Sisema indisponível.', features:[]};
}

function getIDEFeaturesBboxV704(p) {
  try {
    p = p || {};
    var layers = Array.isArray(p.layers) ? p.layers.map(String).filter(Boolean) : [];
    if (!layers.length) return {ok:true, total:0, camadas:[], avisos:[]};
    // Limite defensivo para evitar payload excessivo em uma única chamada.
    layers = layers.slice(0, 15);

    var b = Array.isArray(p.bbox) ? p.bbox : [];
    if (b.length !== 4) throw new Error('BBOX da área não informado.');
    var west=_ideV704Numero_(b[0]), south=_ideV704Numero_(b[1]), east=_ideV704Numero_(b[2]), north=_ideV704Numero_(b[3]);
    if ([west,south,east,north].some(function(x){return x===null;})) throw new Error('BBOX inválido.');
    if (!(west < east && south < north)) throw new Error('BBOX sem extensão válida.');

    var limite = Math.max(1, Math.min(1000, parseInt(p.maxFeatures,10) || 1000));
    var camadas = [], avisos = [], total = 0;
    layers.forEach(function(layer){
      var r = _ideV704FetchGeoJson_(layer,[west,south,east,north],limite);
      if (!r.ok) {
        camadas.push({name:layer, ok:false, erro:r.erro, features:[]});
        avisos.push(layer + ': ' + r.erro);
        return;
      }
      var feats = r.features || [];
      total += feats.length;
      camadas.push({
        name:layer, ok:true, endpoint:r.endpoint,
        total:feats.length, truncado:feats.length>=limite,
        features:feats
      });
      if (feats.length >= limite) avisos.push(layer + ': limite de ' + limite + ' feições atingido.');
    });
    return {ok:true,total:total,camadas:camadas,avisos:avisos};
  } catch(e) {
    return {ok:false,erro:String(e&&e.message?e.message:e),camadas:[],avisos:[]};
  }
}


/* V7.0.8 — alias de compatibilidade para mapas anteriores. */
function criarPacoteModoCampo(payload) {
  return criarPacoteModoCampoV707(payload);
}


/* V7.0.9 — restaura links de PDF nos marcadores */
/** V7.1.2 - Busca links de PDF de Monitoramento Contínuo pela coluna R (GEOCOD_IEF) e AK (LINK DO PDF). */
function getLinksPdfMonitoramento(codigos) {
  try {
    const cfg = FONTES && FONTES.MONITORAMENTO;
    const lista = Array.isArray(codigos) ? codigos.slice(0, 500) : [];
    if (!cfg || !cfg.spreadsheetId || !cfg.sheetId || !lista.length) return { links: {} };

    const procurados = new Set(lista.map(normalizarCodigo).filter(Boolean));
    if (!procurados.size) return { links: {} };

    const ss = SpreadsheetApp.openById(cfg.spreadsheetId);
    const sh = getSheetById(ss, cfg.sheetId);
    if (!sh) return { links: {} };

    const lastRow = sh.getLastRow();
    if (lastRow < 2) return { links: {} };

    // R = GEOCOD_IEF; AK = LINK DO PDF.
    const n = lastRow - 1;
    const geocods = sh.getRange(2, 18, n, 1).getDisplayValues();
    const linkRange = sh.getRange(2, 37, n, 1);
    const linksVals = linkRange.getDisplayValues();

    // RichText é consultado apenas se necessário, evitando custo no carregamento normal.
    let richLinks = null;
    const links = {};
    const pendentes = [];

    for (let i = 0; i < geocods.length; i++) {
      const chave = normalizarCodigo(geocods[i][0]);
      if (!chave || !procurados.has(chave)) continue;
      const url = texto(linksVals[i][0]).trim();
      if (urlValida(url)) links[chave] = url;
      else pendentes.push([i, chave]);
    }

    if (pendentes.length) {
      try { richLinks = linkRange.getRichTextValues(); } catch (e) { richLinks = null; }
      if (richLinks) {
        pendentes.forEach(function(item) {
          const i = item[0], chave = item[1];
          try {
            const rt = richLinks[i] && richLinks[i][0];
            const u = rt && rt.getLinkUrl ? rt.getLinkUrl() : '';
            if (u && urlValida(u)) links[chave] = u;
          } catch (e) {}
        });
      }
    }
    return { links: links };
  } catch (e) {
    console.warn('PDF monitoramento indisponível: ' + (e && e.message ? e.message : e));
    return { links: {} };
  }
}


/**
 * V7.0.11 — Carrega os prazos depois que o mapa já está visível.
 * Uma falha nas planilhas de origem nunca impede a abertura do mapa.
 */
function getPrazosDemandasAsync(registros) {
  try {
    const lista = Array.isArray(registros) ? registros.slice(0, 1000).map(function(d) {
      return {
        tipo: texto(d && d.tipo),
        codigo: texto(d && d.codigo),
        linhaCentral: d && d.linhaCentral
      };
    }) : [];
    if (!lista.length) return { ok: true, registros: [] };
    enriquecerPrazosDemandas(lista);
    enriquecerDocumentosDemandas(lista);
    return { ok: true, registros: lista };
  } catch (e) {
    console.warn('Prazos assíncronos indisponíveis: ' + (e && e.message ? e.message : e));
    return { ok: false, registros: [], erro: String(e && e.message ? e.message : e) };
  }
}


/**
 * V7.0.12 — Encontra links de PDF/pasta para TODAS as fontes de demanda.
 * Usa leitura em lote para não bloquear o carregamento principal do mapa.
 */
function enriquecerDocumentosDemandas(registros) {
  const grupos = {};
  (registros || []).forEach(function(d) {
    try {
      const fonte = fontePorTipo(d.tipo);
      if (!grupos[fonte]) grupos[fonte] = [];
      grupos[fonte].push(d);
    } catch (e) {}
  });

  Object.keys(grupos).forEach(function(nomeFonte) {
    const cfg = FONTES[nomeFonte];
    const demandasFonte = grupos[nomeFonte];
    if (!cfg || !(cfg.pdfHeaders || []).length || !(cfg.chaveHeaders || []).length) return;

    try {
      const ss = SpreadsheetApp.openById(cfg.spreadsheetId);
      const sh = getSheetById(ss, cfg.sheetId);
      if (!sh) return;

      const estrutura = detectarEstruturaCabecalho(sh, cfg);
      const mapaHeaders = mapearHeaders(estrutura.headers);
      const colChave = localizarColuna(mapaHeaders, cfg.chaveHeaders || []);
      const colPdf = localizarColuna(mapaHeaders, cfg.pdfHeaders || []);
      if (!colChave || !colPdf) return;

      const primeiraLinhaDados = estrutura.linhaCabecalho + 1;
      const qtdLinhas = sh.getLastRow() - primeiraLinhaDados + 1;
      if (qtdLinhas < 1) return;

      const chaves = sh.getRange(primeiraLinhaDados, colChave, qtdLinhas, 1).getDisplayValues();
      const rangePdf = sh.getRange(primeiraLinhaDados, colPdf, qtdLinhas, 1);
      const exibidos = rangePdf.getDisplayValues();
      let formulas = null, rich = null;
      try { formulas = rangePdf.getFormulas(); } catch (e) {}
      try { rich = rangePdf.getRichTextValues(); } catch (e) {}

      const indice = new Map();

      function urlLinha(i) {
        let u = texto(exibidos[i] && exibidos[i][0]).trim();
        if (urlValida(u)) return u;

        const f = formulas && formulas[i] ? texto(formulas[i][0]) : '';
        if (f) {
          let m = f.match(/(?:HYPERLINK|HIPERLINK)\s*\(\s*["'](https?:\/\/[^"']+)["']/i);
          if (m && m[1] && urlValida(m[1])) return m[1].replace(/""/g, '"').trim();
          m = f.match(/https?:\/\/[^"'\s;)]+/i);
          if (m && m[0] && urlValida(m[0])) return m[0].trim();
        }

        try {
          const rt = rich && rich[i] && rich[i][0];
          if (rt) {
            const direct = rt.getLinkUrl && rt.getLinkUrl();
            if (direct && urlValida(direct)) return String(direct).trim();
            const runs = rt.getRuns ? rt.getRuns() : [];
            for (let j = 0; j < runs.length; j++) {
              const ru = runs[j].getLinkUrl && runs[j].getLinkUrl();
              if (ru && urlValida(ru)) return String(ru).trim();
            }
          }
        } catch (e) {}
        return '';
      }

      for (let i = 0; i < chaves.length; i++) {
        const chave = normalizarCodigo(chaves[i][0]);
        if (!chave) continue;
        const url = urlLinha(i);
        if (!url) continue;
        if (!indice.has(chave)) indice.set(chave, url);
      }

      demandasFonte.forEach(function(d) {
        const candidatos = candidatosDeCodigo(d.codigo, cfg.removerPrefixosCodigo || []);
        let url = '';
        for (let i = 0; i < candidatos.length; i++) {
          if (indice.has(candidatos[i])) {
            url = indice.get(candidatos[i]);
            break;
          }
        }
        if (url) d.pdfUrl = url;
      });
    } catch (e) {
      console.warn('PDF ' + nomeFonte + ': ' + (e && e.message ? e.message : e));
    }
  });
  return registros;
}




/* =====================================================================
 * V7.0.14 — CAR COMPLETO: TODAS AS FEIÇÕES PÚBLICAS DISPONÍVEIS
 * - Área do imóvel (camada estadual sicar_imoveis_UF)
 * - Descobre automaticamente camadas sicar:CAR_VALIDADO_* no GeoServer
 * - Gera ZIP Shapefile consolidado e KML completo por tema
 * ===================================================================== */

function _carV7013Validar_(codigoCar) {
  var car = String(codigoCar || '').trim().toUpperCase();
  var m = car.match(/^([A-Z]{2})-\d{7}-[A-F0-9]{32}$/);
  if (!m) throw new Error('Número do CAR inválido.');
  return { car: car, uf: m[1] };
}

function _carV7013EscXml_(v) {
  return String(v == null ? '' : v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

function _carV7013Camadas_() {
  var baseRaiz = 'https://geoserver.car.gov.br/geoserver/sicar/ows';
  var conhecidas = [
    'sicar:CAR_VALIDADO_IMOVEL',
    'sicar:CAR_VALIDADO_APP',
    'sicar:CAR_VALIDADO_RESERVA_LEGAL',
    'sicar:CAR_VALIDADO_USO_RESTRITO',
    'sicar:CAR_VALIDADO_VEG_NATIVA'
  ];
  try {
    var url = baseRaiz + '?service=WFS&version=1.0.0&request=GetCapabilities';
    var resp = fetchSicarResilienteV703_(url,{
      method:'get',muteHttpExceptions:true,followRedirects:true,
      headers:{'Accept':'text/xml,application/xml,*/*','User-Agent':'PMMG-Mapa-Demandas/7.0.14'}
    });
    if (resp.getResponseCode() >= 200 && resp.getResponseCode() < 300) {
      var txt = resp.getContentText('UTF-8');
      var re = /<(?:\w+:)?Name>\s*(sicar:CAR_VALIDADO_[A-Z0-9_]+)\s*<\/(?:\w+:)?Name>/g;
      var achadas=[], m;
      while ((m=re.exec(txt)) !== null) if (achadas.indexOf(m[1]) < 0) achadas.push(m[1]);
      if (achadas.length) return achadas;
    }
  } catch(e) {}
  return conhecidas;
}

function _carV7013TituloCamada_(typeName) {
  var s=String(typeName||'').replace(/^sicar:/,'').replace(/^CAR_VALIDADO_/,'');
  var mapa={
    IMOVEL:'Área do Imóvel',
    APP:'Área de Preservação Permanente - APP',
    RESERVA_LEGAL:'Reserva Legal',
    USO_RESTRITO:'Área de Uso Restrito',
    VEG_NATIVA:'Vegetação Nativa',
    AREA_CONSOLIDADA:'Área Consolidada',
    SERVIDAO_ADMINISTRATIVA:'Servidão Administrativa'
  };
  return mapa[s] || s.replace(/_/g,' ').replace(/\b\w/g,function(x){return x.toUpperCase()});
}

function _carV7013Descritores_(codigoCar) {
  var v=_carV7013Validar_(codigoCar);
  var descr=[
    {
      titulo:'Área do Imóvel',
      typeName:'sicar:sicar_imoveis_'+v.uf.toLowerCase(),
      endpoint:'https://geoserver.car.gov.br/geoserver/sicar/ows'
    }
  ];
  _carV7013Camadas_().forEach(function(tn){
    // Evita duplicar o perímetro quando o CAR_VALIDADO_IMOVEL trouxer a mesma geometria.
    if (tn === 'sicar:CAR_VALIDADO_IMOVEL') return;
    descr.push({
      titulo:_carV7013TituloCamada_(tn),
      typeName:tn,
      endpoint:'https://geoserver.car.gov.br/geoserver/sicar/ows'
    });
  });
  return descr;
}

function _carV7013Url_(d,car,formato) {
  var cql="cod_imovel='"+String(car).replace(/'/g,"''")+"'";
  return d.endpoint
    +'?service=WFS&version=1.0.0&request=GetFeature'
    +'&typeName='+encodeURIComponent(d.typeName)
    +'&outputFormat='+encodeURIComponent(formato)
    +'&srsName='+encodeURIComponent(formato==='application/json'?'EPSG:4326':'EPSG:4674')
    +'&cql_filter='+encodeURIComponent(cql);
}

function _carV7013GeoJson_(d,car) {
  try {
    var resp=fetchSicarResilienteV703_(_carV7013Url_(d,car,'application/json'),{
      method:'get',muteHttpExceptions:true,followRedirects:true,
      headers:{'Accept':'application/json','User-Agent':'PMMG-Mapa-Demandas/7.0.14'}
    });
    var status=resp.getResponseCode();
    if(status<200||status>=300) return {ok:false,features:[],erro:'HTTP '+status};
    var obj=JSON.parse(resp.getContentText('UTF-8'));
    return {ok:true,features:Array.isArray(obj.features)?obj.features:[]};
  } catch(e) {
    return {ok:false,features:[],erro:String(e&&e.message?e.message:e)};
  }
}

function obterFeicoesCompletasCarPublico(codigoCar) {
  try {
    var v=_carV7013Validar_(codigoCar);
    var camadas=[],avisos=[];
    _carV7013Descritores_(v.car).forEach(function(d){
      var r=_carV7013GeoJson_(d,v.car);
      if(!r.ok){avisos.push(d.titulo+': '+r.erro);return}
      if(r.features.length) camadas.push({
        titulo:d.titulo,typeName:d.typeName,features:r.features
      });
    });
    return {ok:true,car:v.car,uf:v.uf,camadas:camadas,avisos:avisos,
      totalFeicoes:camadas.reduce(function(a,x){return a+x.features.length},0)};
  } catch(e) {
    return {ok:false,erro:String(e&&e.message?e.message:e),camadas:[],avisos:[]};
  }
}

function _carV7013ZipCamada_(d,car) {
  try {
    // Só solicita shape quando a camada realmente possui feições para o CAR.
    var gj=_carV7013GeoJson_(d,car);
    if(!gj.ok || !gj.features.length) return {ok:true,arquivos:[],quantidade:0};

    var resp=fetchSicarResilienteV703_(_carV7013Url_(d,car,'shape-zip'),{
      method:'get',muteHttpExceptions:true,followRedirects:true,
      headers:{'Accept':'application/zip,application/octet-stream,*/*','User-Agent':'PMMG-Mapa-Demandas/7.0.14'}
    });
    var status=resp.getResponseCode(),blob=resp.getBlob(),bytes=blob.getBytes();
    if(status<200||status>=300||!bytes||bytes.length<2||bytes[0]!==80||bytes[1]!==75){
      return {ok:false,arquivos:[],quantidade:gj.features.length,erro:'HTTP/ZIP inválido'};
    }
    var prefixo=_carV7013TituloCamada_(d.typeName).replace(/[^A-Za-z0-9_-]+/g,'_');
    if(d.typeName.indexOf('sicar_imoveis_')>=0) prefixo='AREA_IMOVEL';
    var arquivos=Utilities.unzip(blob).map(function(b){
      var nome=String(b.getName()||'arquivo');
      var ext='';
      var mm=nome.match(/(\.[A-Za-z0-9]+)$/);if(mm)ext=mm[1].toLowerCase();
      return b.setName(prefixo+ext);
    });
    return {ok:true,arquivos:arquivos,quantidade:gj.features.length};
  } catch(e) {
    return {ok:false,arquivos:[],quantidade:0,erro:String(e&&e.message?e.message:e)};
  }
}

// Substitui a função anterior: agora gera um ZIP com todas as camadas públicas encontradas.
function baixarShapefileCarPublico(codigoCar) {
  try {
    var v=_carV7013Validar_(codigoCar);
    var arquivos=[],resumo=[],avisos=[];
    _carV7013Descritores_(v.car).forEach(function(d){
      var r=_carV7013ZipCamada_(d,v.car);
      if(r.ok && r.arquivos.length){
        arquivos=arquivos.concat(r.arquivos);
        resumo.push(d.titulo+': '+r.quantidade+' feição(ões)');
      } else if(!r.ok) {
        avisos.push(d.titulo+': '+r.erro);
      }
    });
    if(!arquivos.length) return {ok:false,erro:'Nenhuma feição do CAR foi retornada pelo SICAR.'};

    var manifesto=[
      'CAR: '+v.car,
      'Gerado pelo Mapa de Demandas Operacionais',
      '',
      'Camadas incluídas:',
      resumo.join('\n'),
      '',
      avisos.length?'Avisos:\n'+avisos.join('\n'):'Sem avisos.'
    ].join('\n');
    arquivos.push(Utilities.newBlob(manifesto,'text/plain','LEIA-ME.txt'));

    var nome='CAR_'+v.car.replace(/[^A-Z0-9_-]/g,'_')+'_COMPLETO.zip';
    var zip=Utilities.zip(arquivos,nome);
    var bytes=zip.getBytes();
    return {
      ok:true,car:v.car,nomeArquivo:nome,mimeType:'application/zip',
      tamanho:bytes.length,base64:Utilities.base64Encode(bytes),
      camadas:resumo,avisos:avisos
    };
  } catch(e) {
    return {ok:false,erro:'Falha ao gerar Shapefile completo do CAR: '+String(e&&e.message?e.message:e)};
  }
}

function _carV7013CoordKml_(coords) {
  return (coords||[]).map(function(p){
    return Number(p[0])+','+Number(p[1])+',0';
  }).join(' ');
}

function _carV7013GeomKml_(g,nome,desc,estilo) {
  if(!g||!g.type)return '';
  var t=g.type,c=g.coordinates,xml='';
  function pm(geom){
    return '<Placemark><name>'+_carV7013EscXml_(nome)+'</name>'
      +'<description>'+_carV7013EscXml_(desc||'')+'</description>'
      +'<styleUrl>#'+estilo+'</styleUrl>'+geom+'</Placemark>';
  }
  if(t==='Polygon'){
    var rings=c||[];if(!rings.length)return '';
    var geom='<Polygon><outerBoundaryIs><LinearRing><coordinates>'+_carV7013CoordKml_(rings[0])+'</coordinates></LinearRing></outerBoundaryIs>';
    for(var i=1;i<rings.length;i++)geom+='<innerBoundaryIs><LinearRing><coordinates>'+_carV7013CoordKml_(rings[i])+'</coordinates></LinearRing></innerBoundaryIs>';
    geom+='</Polygon>';return pm(geom);
  }
  if(t==='MultiPolygon'){
    var parts=(c||[]).map(function(poly){
      if(!poly||!poly.length)return '';
      var x='<Polygon><outerBoundaryIs><LinearRing><coordinates>'+_carV7013CoordKml_(poly[0])+'</coordinates></LinearRing></outerBoundaryIs>';
      for(var j=1;j<poly.length;j++)x+='<innerBoundaryIs><LinearRing><coordinates>'+_carV7013CoordKml_(poly[j])+'</coordinates></LinearRing></innerBoundaryIs>';
      return x+'</Polygon>';
    }).join('');
    return parts?pm('<MultiGeometry>'+parts+'</MultiGeometry>'):'';
  }
  if(t==='LineString')return pm('<LineString><coordinates>'+_carV7013CoordKml_(c)+'</coordinates></LineString>');
  if(t==='MultiLineString'){
    return pm('<MultiGeometry>'+(c||[]).map(function(x){return '<LineString><coordinates>'+_carV7013CoordKml_(x)+'</coordinates></LineString>'}).join('')+'</MultiGeometry>');
  }
  if(t==='Point')return pm('<Point><coordinates>'+_carV7013CoordKml_([c])+'</coordinates></Point>');
  if(t==='MultiPoint'){
    return pm('<MultiGeometry>'+(c||[]).map(function(x){return '<Point><coordinates>'+_carV7013CoordKml_([x])+'</coordinates></Point>'}).join('')+'</MultiGeometry>');
  }
  return '';
}

function baixarKmlCompletoCarPublico(codigoCar) {
  try {
    var r=obterFeicoesCompletasCarPublico(codigoCar);
    if(!r.ok)return r;
    if(!r.camadas.length)return {ok:false,erro:'Nenhuma feição do CAR foi retornada pelo SICAR.'};

    var cores=['ff16803d','ff2563eb','ffdc2626','ff7c3aed','fff59e0b','ff0891b2','ff475569'];
    var k='<?'+'xml version="1.0" encoding="UTF-8"?'+'>'
      +'<kml xmlns="http://www.opengis.net/kml/2.2"><Document>'
      +'<name>'+_carV7013EscXml_('CAR '+r.car+' - KML completo')+'</name>';

    // Sem preenchimento sólido: PolyStyle 00 = transparente.
    for(var s=0;s<cores.length;s++){
      k+='<Style id="tema'+s+'"><LineStyle><color>'+cores[s]+'</color><width>3</width></LineStyle>'
        +'<PolyStyle><color>00000000</color><fill>0</fill><outline>1</outline></PolyStyle></Style>';
    }

    r.camadas.forEach(function(cam,idx){
      k+='<Folder><name>'+_carV7013EscXml_(cam.titulo)+'</name>';
      cam.features.forEach(function(f,i){
        var p=f.properties||{};
        var nome=cam.titulo+(cam.features.length>1?' '+(i+1):'');
        var desc='CAR: '+r.car;
        if(p.municipio)desc+=' | Município: '+p.municipio;
        if(p.area)desc+=' | Área: '+p.area+' ha';
        k+=_carV7013GeomKml_(f.geometry,nome,desc,'tema'+(idx%cores.length));
      });
      k+='</Folder>';
    });
    k+='</Document></kml>';

    var nome='CAR_'+r.car.replace(/[^A-Z0-9_-]/g,'_')+'_COMPLETO.kml';
    return {
      ok:true,car:r.car,nomeArquivo:nome,mimeType:'application/vnd.google-earth.kml+xml',
      base64:Utilities.base64Encode(Utilities.newBlob(k,'application/vnd.google-earth.kml+xml').getBytes()),
      camadas:r.camadas.map(function(x){return x.titulo+': '+x.features.length}),
      avisos:r.avisos||[]
    };
  } catch(e) {
    return {ok:false,erro:'Falha ao gerar KML completo do CAR: '+String(e&&e.message?e.message:e)};
  }
}

