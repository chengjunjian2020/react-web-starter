type GoogleBaseResponse = {
  credential: string
}

type GoogleCodeClientResponse = {
  code: string
}

type GoogleTokenClientResponse = {
  access_token: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: GoogleBaseResponse) => void
            auto_select?: boolean
          }) => void
          prompt: (callback?: (notification: unknown) => void) => void
          disableAutoSelect: () => void
        }
        oauth2: {
          initCodeClient: (config: {
            client_id: string
            scope: string
            callback: (response: GoogleCodeClientResponse) => void
          }) => {
            requestCode: () => void
          }
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: GoogleTokenClientResponse) => void
          }) => {
            requestAccessToken: () => void
          }
        }
      }
    }
    gapi?: {
      load: (library: 'auth2', callback: () => void) => void
      auth2: {
        init: (config: { client_id: string }) => Promise<void>
        getAuthInstance: () => {
          signIn: () => Promise<{
            getAuthResponse: () => { id_token: string }
          }>
        }
      }
    }
  }
}

export {}
