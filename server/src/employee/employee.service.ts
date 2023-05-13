import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  // All Projects with filters and pagination
  async allEmployee(params: { skip?: number; take?: number; where: any }) {
    try {
      const { skip, take, where } = params;

      if (isNaN(skip)) {
        const maxTime = await this.prisma.employee.aggregate({
          _max: { id: true },
        });
        const total = await this.prisma.employee.count({
          where,
        });
        const data = await this.prisma.employee.findMany({
          take,
          where,
        });

        return {
          success: true,
          maxTime: Number(maxTime._max.id),
          total: total,
          data: data,
        };
      } else {
        const maxTime = await this.prisma.employee.aggregate({
          _max: { id: true },
        });
        const total = await this.prisma.employee.count({
          where,
        });
        const data = await this.prisma.employee.findMany({
          skip,
          take,
          where,
        });

        return {
          success: true,
          maxTime: Number(maxTime._max.id),
          total: total,
          data: data,
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async saveOrUpdateEmployee(employee: any) {
    // console.log(JSON.stringify(project));
    try {
      const response = await this.prisma.employee.upsert({
        where: {
          id: employee.id,
        },
        create: {
          fullName: employee.fullName,
          nameWithInitials: employee.nameWithInitials,
          displayName: employee.displayName,
          gender: employee.gender,
          dob: employee.dob ? employee.dob : null,
          email: employee.email,
          mobileNumber: employee.mobileNumber,
          designation: employee.designation,
          employeeType: employee.empType,
          joinedDate: employee.joinedDate ? employee.joinedDate : null,
          experiance: employee.experiance,
          salary: Number(employee.salary),
          personalNote: employee.personalNote,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        update: {
          fullName: employee.fullName,
          nameWithInitials: employee.nameWithInitials,
          displayName: employee.displayName,
          gender: employee.gender,
          dob: employee.dob ? employee.dob : null,
          email: employee.email,
          mobileNumber: employee.mobileNumber,
          designation: employee.designation,
          employeeType: employee.empType,
          joinedDate: employee.joinedDate ? employee.joinedDate : null,
          experiance: employee.experiance,
          salary: Number(employee.salary),
          personalNote: employee.personalNote,
          updatedAt: new Date(),
        },
      });
      console.log(JSON.stringify(response));
      return {
        success: true,
        status: 201,
      };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }

  async deleteEmployee(employeeId: any) {
    try {
      await this.prisma.employee.delete({
        where: {
          id: Number(employeeId),
        },
      });
      return {
        success: true,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }
}
