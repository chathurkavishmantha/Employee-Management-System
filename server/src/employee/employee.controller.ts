import { Body, Controller, Delete, Param, Post, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('/employee-list')
  async allEmployee(@Body() data: any) {
    const { employeeType } = data.searchFilter;
    const emptype = employeeType !== '' ? { employeeType: employeeType } : {};
    const where = {
      AND: [emptype],
    };
    // if (data.searchFilter !== "") {
    //     where = { where:
    //         data.searchFilter
    //     }
    // }

    console.log('take: ' + data.take);
    return this.employeeService.allEmployee({
      skip: Number(data.skip) - 1,
      take: Number(data.take),
      where: where,
    });
  }
  @Post('employee-save')
  async saveEmployee(@Body() data: any) {
    return this.employeeService.saveOrUpdateEmployee(data);
  }

  @Post('employee-update')
  async updateEmployee(@Body() data: any) {
    return this.employeeService.saveOrUpdateEmployee(data);
  }

  @Delete('employee-delete/:id')
  deleteQuotation(@Param('id') employeeId: string) {
    return this.employeeService.deleteEmployee(employeeId);
  }
}
