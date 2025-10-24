import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

interface EchoProfile {
  sub: string;
  name: string;
  email?: string;
  picture?: string;
}

export default function EchoProvider<P extends EchoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'echo',
    name: 'Echo',
    type: 'oauth',
    authorization: {
      url: 'https://echo.merit.systems/api/oauth/authorize',
      params: {
        scope: 'llm:invoke offline_access',
      },
    },
    token: `https://echo.merit.systems/api/oauth/token?client_id=${options.clientId}`,
    userinfo: {
      url: 'https://echo.merit.systems/api/oauth/userinfo',
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email ?? '',
        image: profile.picture ?? '',
      };
    },
    style: {
      logo: '/icons/echo.png',
      bg: '#fff',
      text: '#000',
    },
    options,
  };
}
