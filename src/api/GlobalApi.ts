import { RestAPI, RestAPIUpload } from './engine/axiosRunner'

export default class GlobalApi {
  restAPI: any = new RestAPI()
  restAPIUpload: any = new RestAPIUpload()

  getAuth = () => {
    return this.restAPI.request('get', '/auth', {})
  }
  getOptions = (keys: string[]) => {
    /* 
    updated from api v1.1.0
    [User Console] signup + learning profile
      learning_profile_experiences
      learning_profile_experience_levels
      learning_profile_industries
      learning_profile_genders
      learning_profile_age_ranges
      learning_profile_highest_degrees

    [User Console] help center
      help_center_products,
      help_center_frequencies,

    [Admin Console] account management
      account_management_purchase_number,
      account_management_status,

    [Admin Console] purchase management
      purchase_management_company,
      purchase_management_status,

    [Admin Console] course management
      course_management_status,
      course_management_learning_goals,

    [Admin Console] admin management
      admin_management_roles,
    */
    return this.restAPI.request('post', '/option', { type: keys })
  }
  uploadImg = (file: any, system: string, system_id: string) => {
    var formData = new FormData()
    formData.append('file', file)
    formData.append('system', system)
    formData.append('system_id', system_id)
    return this.restAPIUpload.request('post', '/archive/image', formData)
  }
  uploadVideo = (file: any, system: string, system_id: string) => {
    var formData = new FormData()
    formData.append('file', file)
    formData.append('system', system)
    formData.append('system_id', system_id)
    return this.restAPIUpload.request('post', '/archive/video', formData)
  }
}
