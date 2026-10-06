type ApiRequest = { method?: string };

type ApiResponse = {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
};

type InstagramMedia = {
  id: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  like_count?: number;
  comments_count?: number;
};

type InstagramMediaResponse = { data?: InstagramMedia[] };
type InstagramProfileResponse = {
  username?: string;
  followers_count?: number;
  media_count?: number;
};

function formatCount(value?: number): string | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Vercel Function: lê as publicações recentes da conta profissional do grupo.
 * O token fica somente no ambiente do servidor, nunca no bundle público do Vite.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method !== 'GET') {
    return res.status(405).json({ configured: false, posts: [] });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(200).json({ configured: false, posts: [] });
  }

  const apiVersion = process.env.INSTAGRAM_API_VERSION || 'v26.0';
  const apiBase = `https://graph.instagram.com/${apiVersion}`;
  const mediaUrl = new URL(`${apiBase}/me/media`);
  mediaUrl.searchParams.set(
    'fields',
    'id,media_type,media_url,thumbnail_url,permalink,like_count,comments_count'
  );
  mediaUrl.searchParams.set('limit', '12');
  mediaUrl.searchParams.set('access_token', accessToken);

  const profileUrl = new URL(`${apiBase}/me`);
  profileUrl.searchParams.set('fields', 'username,followers_count,media_count');
  profileUrl.searchParams.set('access_token', accessToken);

  try {
    const [mediaResponse, profileResponse] = await Promise.all([
      fetch(mediaUrl),
      fetch(profileUrl).catch(() => null),
    ]);

    if (!mediaResponse.ok) {
      // Do not send Meta's error details or the token back to the browser.
      console.error('Instagram media request failed with status', mediaResponse.status);
      return res.status(200).json({ configured: true, posts: [], profile: null });
    }

    const mediaPayload = (await mediaResponse.json()) as InstagramMediaResponse;
    let profile: InstagramProfileResponse | null = null;
    if (profileResponse?.ok) {
      profile = (await profileResponse.json()) as InstagramProfileResponse;
    }

    const posts = (mediaPayload.data ?? [])
      .map((item) => {
        const image = item.media_type === 'VIDEO' ? item.thumbnail_url || item.media_url : item.media_url || item.thumbnail_url;
        return {
          id: item.id,
          image,
          url: item.permalink,
          likes: formatCount(item.like_count),
          comments: formatCount(item.comments_count),
        };
      })
      .filter((post): post is typeof post & { image: string } => Boolean(post.image))
      .slice(0, 6);

    return res.status(200).json({
      configured: true,
      posts,
      profile: profile
        ? {
            username: profile.username,
            followersCount: profile.followers_count,
            mediaCount: profile.media_count,
          }
        : null,
    });
  } catch (error) {
    console.error('Instagram feed request failed', error instanceof Error ? error.message : 'unknown error');
    return res.status(200).json({ configured: true, posts: [], profile: null });
  }
}
