import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from 'axios'
import { defaultDto } from '../utils'
import { BaseUrlType, ConstructorArgsType, RequestConfigType } from '../types'

export class Axios<BaseUrl extends BaseUrlType = BaseUrlType> {
  public baseUrl?: BaseUrl
  private agent: AxiosInstance
  public options: ConstructorArgsType<BaseUrl>['options']
  public otherAxiosAgentConfig: CreateAxiosDefaults<any>
  constructor({ baseUrl, timeout, publicHeaders, options, axiosAgentConfig }: ConstructorArgsType<BaseUrl>) {
    this.baseUrl = baseUrl
    this.options = options
    this.otherAxiosAgentConfig = axiosAgentConfig
    this.agent = axios.create({
      ...axiosAgentConfig,
      baseURL: typeof baseUrl === 'string' ? baseUrl : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...publicHeaders,
      },
      timeout: timeout * 1000,
    })
  }

  async request<ResponseType = any, QueryParamsType = any, RequestDataType = any>(
    url: string,
    configs?: RequestConfigType<RequestDataType, QueryParamsType>,
    middleware?: (data: AxiosResponse) => void,
  ) {
    try {
      let response: AxiosResponse<ResponseType>
      switch (configs?.method) {
        case 'POST':
          response = await this.agent.post(url, configs.data)
          break
        case 'DELETE':
          response = await this.agent.delete(url)
          break
        case 'PATCH':
          response = await this.agent.patch(url, configs.data)
          break
        case 'PUT':
          response = await this.agent.put(url, configs.data)
          break
        case 'GET':
        default:
          response = await this.agent.get(url, {
            params: configs?.queryParams,
          })
          break
      }

      middleware?.(response)

      if (this.options?.hasDefaultDto) {
        if (this.options?.exteraDto) {
          return this.options?.exteraDto(defaultDto(response.data as ResponseType))
        } else {
          return defaultDto(response.data as ResponseType)
        }
      } else {
        return response.data as ResponseType
      }
    } catch (error) {
      return Promise.reject(this.options?.commonErrorDto ? this.options?.commonErrorDto(error) : error)
    }
  }
}
