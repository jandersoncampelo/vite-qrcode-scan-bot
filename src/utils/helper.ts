import validator, { IsURLOptions } from 'validator';

// Definição de tipos para as funções
interface UrlValidationResult {
  is_url: boolean;
  value: string;
}

interface Coordinate {
  lat: string;
  lng: string;
}

interface WifiInfo {
  [key: string]: string;
}

interface VCardInfo {
  [key: string]: string;
}

// Função para preparar URLs
export function prepareUrl(code: string): UrlValidationResult {
  const urlOptions: IsURLOptions = {
    protocols: ['http', 'https', 'ftp'],
    require_tld: true,
    require_protocol: true, // requiring protocol
    require_host: true,
    require_port: false,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    allow_fragments: true,
    allow_query_components: true,
    disallow_auth: false,
    validate_length: true
  };

  if (validator.isURL(code, urlOptions)) {
    return { is_url: true, value: code };
  }

  if (validator.isURL(code)) {
    return { is_url: true, value: 'http://' + code };
  }
  return { is_url: false, value: code };
}

// Função para preparar coordenadas
export function prepareCoordinate(data: string): Coordinate {
  // Remove a string 'geo:'
  const code = data.replace('geo:', '');
  // Divide a string em duas partes
  const parts = code.split(',');
  return { lat: parts[0], lng: parts[1] };
}

// Função para preparar informações de WiFi
export function prepareWifi(data: string): WifiInfo {
  // Remove a string 'WIFI:'
  const code = data.replace('WIFI:', '');
  // Divide a string em várias partes
  const parts = code.split(';');
  const wifi_info: WifiInfo = {};
  // Loop sobre as partes
  for (let i = 0; i < parts.length; i++) {
    const fragments = parts[i].split(':');
    if (fragments[0] === '') {
      continue;
    }
    wifi_info[fragments[0]] = fragments[1];
  }
  return wifi_info;
}

// Função para preparar informações de VCard
export function prepareVCard(data: string): VCardInfo {
  let raw_data = data.replace('BEGIN:VCARD\n', '');
  raw_data = raw_data.replace('END:VCARD\n', '');
  const parts = raw_data.split('\n');
  const vcard_info: VCardInfo = {};
  for (let i = 0; i < parts.length; i++) {
    const fragments = parts[i].split(':');
    if (fragments[0] === '') {
      continue;
    }
    vcard_info[fragments[0]] = fragments[1];
  }
  return vcard_info;
}

// Função para detectar o tipo de código
export function detectCodeType(code: string): string {
  if (code.startsWith("geo:")) {
    return "geo";
  } else if (code.startsWith("WIFI:")) {
    return "wifi";
  } else if (code.startsWith("BEGIN:VCARD")) {
    return "vcard";
  } else if (code.startsWith("http")) {
    return "url";
  }
  return "text";
}