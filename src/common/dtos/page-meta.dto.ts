import { IPageMetaDtoParameters } from '../interfaces';

export class PageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly totalCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, totalCount }: IPageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.totalCount = totalCount;
    this.pageCount = Math.ceil(this.totalCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
