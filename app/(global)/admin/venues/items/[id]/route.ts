import apiRequest from '@/src/lib/apiRouter';

export async function GET(_r: Request, {params}: {params: {id: string}}) {
  const {id} = params;
  const res = await apiRequest({
    uri: `admin/venue?venue_id=${id}`,
    auth: true,
  });

  return Response.json(res);
}
