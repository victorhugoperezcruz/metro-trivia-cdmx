/**
 * stationLogo.js
 * Convierte el nombre de una estación del Metro CDMX al nombre de archivo
 * de su logo PNG en /client/public/logos/
 *
 * Reglas:
 *  - Minúsculas
 *  - Sin tildes ni caracteres especiales
 *  - Sin espacios, guiones ni puntos
 *  - Sin "UAM-I" → "uami", "UAM-Azcapotzalco" → "uamazcapotzalco"
 */

const MAP = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'a', 'É': 'e', 'Í': 'i', 'Ó': 'o', 'Ú': 'u',
    'ü': 'u', 'Ü': 'u', 'ñ': 'n', 'Ñ': 'n',
}

export function stationToImageKey(name) {
    return name
        .split('')
        .map(c => MAP[c] ?? c)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // elimina todo lo que no sea letra/número
}

export function getStationLogoUrl(stationName) {
    return `/logos/${stationToImageKey(stationName)}.png`
}
