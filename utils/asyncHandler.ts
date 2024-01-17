import { NextRequest, NextResponse } from "next/server";

const asyncHendler = (requestHandler: (req: NextRequest, res: NextResponse, next: any) => Promise<any>) => {
    return (req: NextRequest, res: NextResponse, next: any) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err: any) => next(err));
    };
};

export { asyncHendler };

