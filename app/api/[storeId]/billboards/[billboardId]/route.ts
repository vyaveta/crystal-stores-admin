import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { billboardId: string }}
) {
    try{
        if(!params.billboardId) return new NextResponse("billboard id is required", { status: 400})

        const billboards = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId 
            }
        })

        return NextResponse.json(billboards)
    }catch(error){
        return new NextResponse("internal server error")
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string }}
) {
    try{
        const { userId } = auth()
        if(!userId) return new NextResponse("UnAuthorized!", { status: 401 })

        const body = await req.json()
        const { label, imageUrl } = body

        if(!label) return new NextResponse("Label is required!",{ status: 400})
        if(!imageUrl) return new NextResponse("imageUrl is required", { status: 400})
        if(!params.billboardId) return new NextResponse("billboard id is required", { status: 400}) 

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("Access denied",{ status: 401 })

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl,
            }
        })

        return NextResponse.json(billboard)

   }catch(error){
        console.log("Error from billboardId patch", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string , billboardId: string} }
) {
    try{
        const { userId } = auth()
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })
        if(!params.storeId) return new NextResponse("Store not found", { status: 404 })
        if(!params.billboardId) return new NextResponse("billboard not found", { status: 404 })

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("Access denied",{ status: 401 })

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        })
        return NextResponse.json(billboard)
    }catch(error){
        console.log("[DELETE_Billboard]",error)
        return new NextResponse('Server Error', {status : 500})
    }
}