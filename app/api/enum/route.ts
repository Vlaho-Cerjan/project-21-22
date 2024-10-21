import apiRequest from '@/src/lib/apiRouter';

export async function GET() {
  const res: {
    data: any;
    success: boolean;
  } = await apiRequest({
    uri: 'api/enum',
  });

  return Response.json(res);
}
