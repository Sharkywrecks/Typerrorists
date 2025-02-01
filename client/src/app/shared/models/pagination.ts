import { ProductToReturnDto, ProductToReturnDtoPagination } from "../../client.api";

export class Pagination implements ProductToReturnDtoPagination {
    pageIndex!: number;
    pageSize!: number;
    count!: number;
    data: ProductToReturnDto[] = [];
}