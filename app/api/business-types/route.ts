import apiRequest from '@/src/lib/apiRouter';

export async function GET() {
  const res: {
    data: any;
    success: boolean;
  } = await apiRequest({
    uri: 'api/business-types',
  });

  return Response.json(res);
}
