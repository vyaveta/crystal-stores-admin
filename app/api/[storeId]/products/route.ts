import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth()
        if (!userId) return new NextResponse("UnAuthorised", { status: 401 })

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
        stokes } = body
        if(!name || !price || !categoryId || !sizeId || !colorId || !images || !images.length ) return new NextResponse("some datas are missing!!", { status: 400 })
        if (!params.storeId) return new NextResponse("storeId is required", { status: 400 })

        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if (!storeByUser) return new NextResponse("access denied!", { status: 400 })

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                description,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
                stokes,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {

        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const isFeatured = searchParams.get("isFeatured")


        if (!params.storeId) return new NextResponse("storeId is required", { status: 400 })

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true: undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(products)

    } catch (error) {
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}