class Pages {
    /** First page
     * @example 'number'
     */
    first: number

    /** Previous page or `null` if the current page is the first one
     * @example 'number'
     */
    previous: number

    /** Current page
     * @example 'number'
     */
    current: number

    /** Next page or `null` if the current page is the last one
     * @example 'number'
     */
    next: number

    /** Last page
     * @example 'number'
     */
    last: number
}

export class Pagination {
    /** Pagination property that contains the list of pages */
    pages: Pages
}

export class PaginationQueryParams {
    /* Page */
    page?: number = 1

    /* Items per page */
    perPage?: number = 20

    /* Field name to order by */
    orderBy?: string = 'id'

    /* Sort direction */
    sort?: Sort = Sort.asc
}

enum Sort {
    asc = 'asc',
    desc = 'desc'
}