import { Op } from 'sequelize';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

export default {
  transformOrder(order: string, availableAttributes: string[]): string[][] {
    const result = [];

    for (const sort of order.split(',')) {
      if (sort === '' || sort === '-') {
        continue;
      }

      let attribute = sort;
      let ordering = 'ASC';

      if (sort[sort.length - 1] === '-') {
        attribute = sort.substr(0, sort.length - 1);
        ordering = 'DESC';
      }

      if (!availableAttributes.includes(attribute)) {
        throw new ServerError(ServerErrorType.LOOKUP_UNKNOWN_ORDER_ATTRIBUTE, attribute);
      }

      result.push([attribute, ordering]);
    }

    return result;
  },

  transformLoad(load: string, availableAttributes: string[]): string[] {
    const result = [];

    for (const attribute of load.split(',')) {
      if (attribute === '') {
        continue;
      }

      if (!availableAttributes.includes(attribute)) {
        throw new ServerError(ServerErrorType.LOOKUP_UNKNOWN_LOAD_ATTRIBUTE, attribute);
      }

      result.push(attribute);
    }

    return result;
  },

  transformPage(page: string): { offset: number; limit: number } {
    const bounds = page.split(',');

    let end = 0;
    if (bounds.length === 1) {
      const components = bounds[0].split('.');

      end += (+components[0] + 1) * 10;
      end += components.length === 2 ? +components[1] : 0;
    } else {
      const components = bounds[1].split('.');

      end += (+components[0] + 1) * 10;
      end += components.length === 2 ? +components[1] : 0;
    }

    let start = end - 10;
    if (bounds.length === 2) {
      const components = bounds[0].split('.');

      start = +components[0] * 10;
      start += components.length === 2 ? +components[1] : 0;

      end -= 10;
    }

    if (start > end) {
      throw new ServerError(
        ServerErrorType.LOOKUP_START_PAGE_IS_BIGGER_THAN_STOP_PAGE,
        bounds[0],
        bounds[1],
      );
    }

    return { offset: start, limit: end - start };
  },

  transformRange(value: string, parts: any[], defaultStart: any): any[] {
    if (parts.length === 1) {
      return [parts[0]];
    }

    if (value.startsWith(',')) {
      parts[0] = defaultStart;
    } else if (value.endsWith(',')) {
      return [parts[0]];
    }

    return parts;
  },

  generateRangeQuery(rangeItems: any[]): { [Op.gte]?: any; [Op.lte]?: any } {
    if (rangeItems.length === 1) {
      return {
        [Op.gte]: rangeItems[0],
      };
    } else {
      if (rangeItems[0] > rangeItems[1]) {
        throw new ServerError(
          ServerErrorType.LOOKUP_START_RANGE_IS_BIGGER_THAN_STOP_RANGE,
          rangeItems[0],
          rangeItems[1],
        );
      }
      return {
        [Op.gte]: rangeItems[0],
        [Op.lte]: rangeItems[1],
      };
    }
  },
};
