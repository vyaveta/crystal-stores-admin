import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { productId: string }}
) {
    try{
        if(!params.productId) return new NextResponse("product id is required", { status: 400})

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId 
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            }
        })

        return NextResponse.json(product)
    }catch(error){
        return new NextResponse("internal server error")
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string }}
) {
    try{
        const { userId } = auth()
        if(!userId) return new NextResponse("UnAuthorized!", { status: 401 })

        const body = await req.json()

        const { name,
            price,
            categoryId,
            sizeId,
            description,
            colorId,
            images,
            isFeatured,
            isArchived, 
        stokes} = body
        console.log("[REQ_BODY__PRODUCT_PATCH",body)
        if(!name || !price || !categoryId || !sizeId || !colorId || !images || !images.length) return new NextResponse("some datas are missing!!", { status: 400 })
        
        if(!params.productId) return new NextResponse("billboard id is required", { status: 400}) 

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("Access denied",{ status: 401 })

         await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                description,
                price,
                categoryId,
                sizeId,
                colorId,
                stokes,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived,
            }
        })

        const product = await prismadb.product.update({
            where:{id : params.productId},
            data: {
               images: {
                createMany: {
                       data: [
                        ...images.map((image: { url: string }) => image)
                       ] 
                }
               } 
            }
        })

        return NextResponse.json(product)

   }catch(error){
        console.log("[PRODUCT_PATCH]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string , productId: string} }
) {
    try{
        const { userId } = auth()
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })
        if(!params.storeId) return new NextResponse("Store not found", { status: 404 })
        if(!params.productId) return new NextResponse("billboard not found", { status: 404 })

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if(!storeByUser) return new NextResponse("Access denied",{ status: 401 })

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        })
        return NextResponse.json(product)
    }catch(error){
        console.log("[DELETE_PRODUCT]",error)
        return new NextResponse('Server Error', {status : 500})
    }
}