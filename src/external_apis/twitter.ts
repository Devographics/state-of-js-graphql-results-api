import TwitterApi from 'twitter-api-v2'
import { Db } from 'mongodb'

// Instanciate with desired auth type (here's Bearer v2 auth)
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || '')

// Tell typescript it's a readonly app
const roClient = twitterClient.readOnly

// https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/v2.md#users-by-usernames

// export const fetchTwitterResources = async (ids: string[]) => {
//   console.log('// fetchTwitterResource')
//   try {
//       const data = await roClient.v2.usersByUsernames(ids, { 'user.fields': 'profile_image_url' })

//       console.log(data)
//       // const user = data && data.data
//       // const avatarUrl = user?.profile_image_url?.replace('_normal', '')
//       return []
//   } catch (error) {
//       console.log(error)
//       return
//   }
// }

// https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/v2.md#single-user-by-username

export const fetchTwitterResource = async (db: Db, id: string) => {
    try {
        const data = await roClient.v2.userByUsername(id, { 'user.fields': 'profile_image_url' })
        const user = data && data.data
        const avatarUrl = user?.profile_image_url?.replace('_normal', '')
        return { userName: id, avatarUrl }
    } catch (error: any) {
      console.log('// fetchTwitterResource error')
      // console.log(error)
      console.log(error.rateLimit)
      console.log(error.data)
      return
    }
}
