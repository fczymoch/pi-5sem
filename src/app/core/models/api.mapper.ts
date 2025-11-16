import { Forklift } from './forklift';
import { Employee } from './employee';
import { ActivityLog } from './activity-log';
import { ForkliftUsage } from './forklift-usage';
import { ApiForkliftResponse, ApiEmployeeResponse, ApiDashboardResponse, ApiActivityLogResponse, ApiForkliftUsageHistoryResponse } from './api.interfaces';

export class ApiMapper {
  
  static mapForkliftFromApi(apiForklift: ApiForkliftResponse): Forklift {
    console.log('🔄 Mapper: Mapeando empilhadeira da API:', apiForklift);
    
    // Extrair informações da descrição
    const description = apiForklift.descricao;
    
    // Regex para extrair modelo e capacidade da descrição
    // Ex: "Empilhadeira Elétrica Yale ERC030VG - Cap. 3T"
    const modelMatch = description.match(/Empilhadeira\s+\w+\s+(\w+)\s+(\w+)/);
    const capacityMatch = description.match(/Cap\.\s+(\d+(?:\.\d+)?)T/);
    const typeMatch = description.match(/Empilhadeira\s+(\w+)/);
    
    const manufacturer = modelMatch ? modelMatch[1] : 'N/A';
    const model = modelMatch ? modelMatch[2] : description.split(' - ')[0];
    const capacity = capacityMatch ? parseFloat(capacityMatch[1]) : 0;
    const type = typeMatch ? typeMatch[1] : 'Padrão';
    
    // Mapear status: 0=manutenção, 1=disponível, 2=em uso
    let status: 'available' | 'inUse' | 'maintenance';
    if (apiForklift.status === 0) {
      status = 'maintenance';
    } else if (apiForklift.flagUso === 1) {
      status = 'inUse';
    } else {
      status = 'available';
    }
    
    const mapped: Forklift = {
      id: apiForklift.id,
      model: model,
      serialNumber: `SN${apiForklift.id.toString().padStart(4, '0')}`, // Gerar número de série
      manufacturer: manufacturer,
      capacity: capacity,
      lastMaintenanceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      nextMaintenanceDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias à frente
      status: status,
      location: `Setor ${Math.ceil(apiForklift.id / 5)}`, // Agrupar por setores
      assignedTo: apiForklift.flagUso === 1 ? apiForklift.id * 100 : undefined // ID fictício do operador
    };
    
    console.log('✅ Mapper: Empilhadeira mapeada:', mapped);
    return mapped;
  }

  static mapForkliftToApi(forklift: Forklift | Omit<Forklift, 'id'>): any {
    return {
      model: forklift.model,
      serialNumber: forklift.serialNumber,
      manufacturer: forklift.manufacturer,
      capacity: forklift.capacity,
      lastMaintenanceDate: forklift.lastMaintenanceDate?.toISOString().split('T')[0],
      nextMaintenanceDate: forklift.nextMaintenanceDate?.toISOString().split('T')[0],
      location: forklift.location
    };
  }

  static mapEmployeeFromApi(apiEmployee: ApiEmployeeResponse): Employee {
    console.log('🔄 Mapper: Mapeando funcionário da API:', apiEmployee);
    
    // Mapa para converter cargo numérico em string
    const positionMap: {[key: number]: string} = {
      1: 'Operador',
      2: 'Supervisor',
      3: 'Gerente',
      4: 'Diretor'
    };
    
    const mapped: Employee = {
      id: apiEmployee.id,
      name: apiEmployee.nome,
      position: positionMap[apiEmployee.cargo] || 'Cargo não definido',
      department: 'Operações', // Default até ter no backend
      email: `funcionario${apiEmployee.id}@empresa.com`, // Default até ter no backend
      phone: '(11) 99999-9999', // Default até ter no backend
      hiringDate: new Date(), // Default até ter no backend
      status: apiEmployee.status === 1 ? 'active' : 'inactive',
      lastTrainingDate: new Date(), // Default até ter no backend
      courses: [] // Default até ter no backend
    };
    
    console.log('✅ Mapper: Funcionário mapeado:', mapped);
    return mapped;
  }

  static mapEmployeeToApi(employee: Employee | Omit<Employee, 'id'>): any {
    return {
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      hiringDate: employee.hiringDate?.toISOString().split('T')[0],
      certifications: [], // Employee model doesn't have certifications, use empty array
      courses: employee.courses || []
    };
  }

  static mapDashboardFromApi(apiDashboard: ApiDashboardResponse): any {
    return {
      forkliftStatus: {
        available: apiDashboard.forkliftStatus.available,
        inUse: apiDashboard.forkliftStatus.inUse,
        maintenance: apiDashboard.forkliftStatus.maintenance
      },
      employeeCertifications: {
        valid: apiDashboard.employeeCertifications.valid,
        expiring: apiDashboard.employeeCertifications.expiring,
        expired: apiDashboard.employeeCertifications.expired
      },
      stats: {
        totalForklifts: apiDashboard.stats.totalForklifts,
        totalEmployees: apiDashboard.stats.totalEmployees,
        maintenanceCount: apiDashboard.forkliftStatus.maintenance,
        availableCount: apiDashboard.forkliftStatus.available,
        activeEmployees: apiDashboard.stats.activeEmployees,
        activeUsages: apiDashboard.stats.activeUsages
      }
    };
  }

  private static mapForkliftStatus(apiStatus: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE'): 'available' | 'inUse' | 'maintenance' {
    switch (apiStatus) {
      case 'AVAILABLE': return 'available';
      case 'IN_USE': return 'inUse';
      case 'MAINTENANCE': return 'maintenance';
      default: return 'available';
    }
  }

  private static mapEmployeeStatus(apiStatus: 'ACTIVE' | 'INACTIVE'): 'active' | 'inactive' {
    switch (apiStatus) {
      case 'ACTIVE': return 'active';
      case 'INACTIVE': return 'inactive';
      default: return 'active';
    }
  }

  static mapActivityLogFromApi(apiActivity: ApiActivityLogResponse): ActivityLog {
    console.log('🔄 Mapper: Mapeando log de atividade da API:', apiActivity);
    
    // Mapear tipo de operação para ícone e cor
    const iconMap: {[key: string]: {icon: string, color: string}} = {
      'CREATE': { icon: 'add_circle', color: 'primary' },
      'UPDATE': { icon: 'edit', color: 'accent' },
      'DELETE': { icon: 'delete', color: 'warn' },
      'ASSIGN': { icon: 'assignment_ind', color: 'primary' },
      'MAINTENANCE': { icon: 'build', color: 'warn' },
      'COMPLETE': { icon: 'check_circle', color: 'primary' },
      'LOGIN': { icon: 'login', color: 'accent' },
      'LOGOUT': { icon: 'logout', color: 'accent' }
    };

    const typeMapping = iconMap[apiActivity.tipoOperacao] || { icon: 'info', color: 'primary' };

    const mapped: ActivityLog = {
      id: apiActivity.id,
      operationType: apiActivity.tipoOperacao,
      entity: apiActivity.entidade,
      description: apiActivity.descricao,
      timestamp: new Date(apiActivity.dataHora),
      details: apiActivity.detalhes,
      icon: typeMapping.icon,
      color: typeMapping.color
    };

    console.log('✅ Mapper: Log de atividade mapeado:', mapped);
    return mapped;
  }

  static mapForkliftUsageHistoryFromApi(apiUsage: ApiForkliftUsageHistoryResponse): ForkliftUsage {
    console.log('🔄 Mapper: Mapeando histórico de uso da API:', apiUsage);
    
    // Mapa para converter cargo numérico em string
    const positionMap: {[key: number]: string} = {
      1: 'Operador',
      2: 'Supervisor',
      3: 'Gerente',
      4: 'Diretor'
    };

    const mapped: ForkliftUsage = {
      id: apiUsage.idUso,
      employeeId: apiUsage.idFuncionario,
      forkliftId: 0, // Será definido pelo componente
      startTime: new Date(apiUsage.dataInicio),
      endTime: apiUsage.dataFim ? new Date(apiUsage.dataFim) : undefined,
      employee: {
        id: apiUsage.idFuncionario,
        name: apiUsage.nomeFuncionario,
        position: positionMap[apiUsage.cargoFuncionario] || 'Cargo não definido'
      },
      forklift: undefined // Será definido pelo componente se necessário
    };

    // Adiciona a duração como propriedade adicional (não faz parte da interface)
    (mapped as any).duracaoHoras = apiUsage.duracaoHoras;

    console.log('✅ Mapper: Histórico de uso mapeado:', mapped);
    return mapped;
  }
}