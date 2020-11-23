import {environment} from '../../../environments/environment'

export const ENDPOINTS = {
    GET_ALL_PLAY_URL:environment.serverUrl+environment.allPlayUrl,
    GET_PREDICTION_PLAY_URL:environment.serverUrl+environment.getPrediction,
    GET_HISTORICAL_MATCHES_URL:environment.serverUrl + environment.historicalMatchUrl,
    GET_STRATEGY:environment.serverUrl + environment.strategyUrl
}
