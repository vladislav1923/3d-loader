export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file');

    console.log('file: ', file)

    return new Response('Got it', { status: 200 });
}
