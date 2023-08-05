import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string }}
) {
    try{
        const { userId } = auth()
        if(!userId) return new NextResponse("UnAuthorised",{ status: 401 })

        const body = await req.json()
        const { label, imageUrl } = body
        if(!label) return new NextResponse("label is required", { status: 400 })
        if(!imageUrl) return new NextResponse("imageUrl is required", { status: 400 })
        if(!params.storeId) return new NextResponse("storeId is required", { status: 400})

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("access denied!", { status: 400 })

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard)

    }catch(error){
        console.log("Error in Billboards POST", error);
        return new NextResponse("Internal Server Error",{ status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string }}
) {
    try{
        if(!params.storeId) return new NextResponse("storeId is required", { status: 400})

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId 
            }
        })

        return NextResponse.json(billboards)

    }catch(error){
        console.log("Error in Billboards POST", error);
        return new NextResponse("Internal Server Error",{ status: 500 })
    }
}