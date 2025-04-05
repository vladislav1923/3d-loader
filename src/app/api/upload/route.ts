import generator from "@/utils/generator";

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file');

    // TODO: Add validation for file type and size

    const base64Image = await generator(file as File);

    return new Response(JSON.stringify({ base64Image }), { status: 200 });
}
