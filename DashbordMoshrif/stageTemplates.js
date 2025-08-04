const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../sql/sqlite');
const { verifyJWT } = require('../middleware/jwt');
router.use(verifyJWT);

// GET /api/stage-templates - جلب جميع قوالب المراحل
router.get('/', async (req, res, next) => {
  try {
    console.log('📊 Fetching stage templates from StagesTemplet...');
    
    // استخدام الجدول الموجود StagesTemplet
    // جمع البيانات حسب Type (نوع القالب)
    const templatesQuery = `
      SELECT DISTINCT Type as name,
             COUNT(*) as stageCount,
             AVG(Days) as avgDays,
             MIN(StartDate) as createdAt
      FROM StagesTemplet 
      WHERE Type IS NOT NULL AND Type != ''
      GROUP BY Type
      ORDER BY Type
    `;
    
    const templates = await db.getAllRows(templatesQuery);
    console.log('✅ Templates found:', templates);
    
    // تحويل البيانات إلى الشكل المطلوب
    const formattedTemplates = templates.map((template, index) => ({
      id: index + 1,
      name: template.name || 'قالب افتراضي',
      description: `قالب يحتوي على ${template.stageCount} مراحل`,
      category: 'عام',
      estimatedDuration: Math.round(template.avgDays || 30),
      stageCount: template.stageCount,
      isActive: true,
      createdAt: template.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      data: formattedTemplates,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: formattedTemplates.length,
        itemsPerPage: formattedTemplates.length
      },
      message: `تم العثور على ${formattedTemplates.length} قالب`
    });
  } catch (error) {
    console.error('❌ Error in stage templates:', error);
    // إذا حدث خطأ، أرجع قائمة فارغة بدلاً من خطأ
    res.json({
      success: true,
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 0
      },
      message: 'لا توجد قوالب متاحة حالياً'
    });
  }
});

// GET /api/stage-templates/:id - جلب قالب محدد
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`📊 Fetching template with id: ${id}`);
    
    // البحث حسب Type من جدول StagesTemplet
    const templatesQuery = `
      SELECT DISTINCT Type as name,
             COUNT(*) as stageCount,
             AVG(Days) as avgDays,
             MIN(StartDate) as createdAt
      FROM StagesTemplet 
      WHERE Type IS NOT NULL AND Type != ''
      GROUP BY Type
    `;
    
    const templates = await db.getAllRows(templatesQuery);
    const templateIndex = parseInt(id) - 1;
    
    if (templateIndex < 0 || templateIndex >= templates.length) {
      return res.status(404).json({
        success: false,
        error: 'القالب غير موجود',
        code: 'TEMPLATE_NOT_FOUND'
      });
    }

    const template = templates[templateIndex];
    const formattedTemplate = {
      id: parseInt(id),
      name: template.name || 'قالب افتراضي',
      description: `قالب يحتوي على ${template.stageCount} مراحل`,
      category: 'عام',
      estimatedDuration: Math.round(template.avgDays || 30),
      stageCount: template.stageCount,
      isActive: true,
      createdAt: template.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: formattedTemplate
    });
  } catch (error) {
    console.error('❌ Error fetching template:', error);
    res.status(404).json({
      success: false,
      error: 'القالب غير موجود',
      code: 'TEMPLATE_NOT_FOUND'
    });
  }
});

// GET /api/stage-templates/:id/stages - جلب قالب مع مراحله
router.get('/:id/stages', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`📊 Fetching template with stages, id: ${id}`);
    
    // الحصول على قائمة الأنواع (القوالب)
    const templatesQuery = `
      SELECT DISTINCT Type as name,
             COUNT(*) as stageCount,
             AVG(Days) as avgDays,
             MIN(StartDate) as createdAt
      FROM StagesTemplet 
      WHERE Type IS NOT NULL AND Type != ''
      GROUP BY Type
      ORDER BY Type
    `;
    
    const templates = await db.getAllRows(templatesQuery);
    const templateIndex = parseInt(id) - 1;
    
    if (templateIndex < 0 || templateIndex >= templates.length) {
      return res.status(404).json({
        success: false,
        error: 'القالب غير موجود',
        code: 'TEMPLATE_NOT_FOUND'
      });
    }

    const template = templates[templateIndex];
    
    // الحصول على المراحل لهذا النوع من القالب
    const stagesQuery = `
      SELECT StageID as id,
             StageName as name,
             Type,
             Days as estimatedDuration,
             StartDate,
             EndDate,
             OrderBy as \`order\`
      FROM StagesTemplet 
      WHERE Type = ?
      ORDER BY OrderBy, StageID
    `;
    
    const stages = await db.getAllRows(stagesQuery, [template.name]);
    
    // تنسيق البيانات
    const formattedTemplate = {
      id: parseInt(id),
      name: template.name || 'قالب افتراضي',
      description: `قالب يحتوي على ${template.stageCount} مراحل`,
      category: 'عام',
      estimatedDuration: Math.round(template.avgDays || 30),
      stageCount: template.stageCount,
      isActive: true,
      createdAt: template.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stages: stages.map(stage => ({
        id: stage.id,
        name: stage.name || 'مرحلة غير محددة',
        description: `مرحلة من ${stage.Type}`,
        order: stage.order || 1,
        estimatedDuration: stage.estimatedDuration || 7,
        startDate: stage.StartDate,
        endDate: stage.EndDate,
        createdAt: stage.StartDate || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    };

    res.json({
      success: true,
      data: formattedTemplate
    });
  } catch (error) {
    console.error('❌ Error fetching template with stages:', error);
    res.status(404).json({
      success: false,
      error: 'القالب غير موجود',
      code: 'TEMPLATE_NOT_FOUND'
    });
  }
});

// GET /api/stage-templates/:id/stages/list - جلب مراحل قالب فقط
router.get('/:id/stages/list', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if template exists
    const template = await db.get('SELECT id FROM Templet WHERE id = ?', [id]);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'القالب غير موجود',
        code: 'TEMPLATE_NOT_FOUND'
      });
    }

    const stages = await db.all('SELECT * FROM StagesTemplet WHERE templateId = ? ORDER BY `order`', [id]);

    res.json({
      success: true,
      data: stages
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/stage-templates - إنشاء قالب جديد
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      estimatedDuration,
      stages = []
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'اسم القالب مطلوب',
        code: 'NAME_REQUIRED'
      });
    }

    const templateData = {
      id: uuidv4(),
      name,
      description: description || null,
      category: category || 'عام',
      estimatedDuration: parseInt(estimatedDuration) || 30,
      isActive: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create template and stages in transaction
    const queries = [
      {
        sql: 'INSERT INTO Templet (id, name, description, category, estimatedDuration, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        params: [templateData.id, templateData.name, templateData.description, templateData.category, templateData.estimatedDuration, templateData.isActive, templateData.createdAt, templateData.updatedAt]
      }
    ];

    // Add stages if provided
    if (Array.isArray(stages) && stages.length > 0) {
      stages.forEach((stage, index) => {
        const stageData = {
          id: uuidv4(),
          templateId: templateData.id,
          name: stage.name || `المرحلة ${index + 1}`,
          description: stage.description || null,
          order: stage.order || index + 1,
          estimatedDuration: parseInt(stage.estimatedDuration) || 7,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        queries.push({
          sql: 'INSERT INTO StagesTemplet (id, templateId, name, description, `order`, estimatedDuration, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          params: [stageData.id, stageData.templateId, stageData.name, stageData.description, stageData.order, stageData.estimatedDuration, stageData.createdAt, stageData.updatedAt]
        });
      });
    }

    await db.transaction(queries);

    // Get created template with stages
    const createdTemplate = await db.get('SELECT * FROM Templet WHERE id = ?', [templateData.id]);
    const createdStages = await db.all('SELECT * FROM StagesTemplet WHERE templateId = ? ORDER BY `order`', [templateData.id]);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء القالب بنجاح',
      data: {
        ...createdTemplate,
        stages: createdStages
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/stage-templates/:id/stages - إضافة مرحلة لقالب
router.post('/:id/stages', async (req, res, next) => {
  try {
    const { id: templateId } = req.params;
    const {
      name,
      description,
      order,
      estimatedDuration = 7
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'اسم المرحلة مطلوب',
        code: 'NAME_REQUIRED'
      });
    }

    // Check if template exists
    const template = await db.get('SELECT id FROM Templet WHERE id = ?', [templateId]);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'القالب غير موجود',
        code: 'TEMPLATE_NOT_FOUND'
      });
    }

    // Get next order if not provided
    let stageOrder = order;
    if (!stageOrder) {
      const lastStage = await db.get(
        'SELECT MAX(`order`) as maxOrder FROM StagesTemplet WHERE templateId = ?',
        [templateId]
      );
      stageOrder = (lastStage?.maxOrder || 0) + 1;
    }

    const stageData = {
      id: uuidv4(),
      templateId,
      name,
      description: description || null,
      order: parseInt(stageOrder),
      estimatedDuration: parseInt(estimatedDuration),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.create('StagesTemplet', stageData);

    res.status(201).json({
      success: true,
      message: 'تم إضافة المرحلة للقالب بنجاح',
      data: stageData
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/stage-templates/:id - تحديث قالب
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove id and timestamps from update data
    delete updateData.id;
    delete updateData.createdAt;
    updateData.updatedAt = new Date().toISOString();

    // Check if template exists
    const template = await db.findById('Templet', id);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'القالب غير موجود',
        code: 'TEMPLATE_NOT_FOUND'
      });
    }

    await db.update('Templet', id, updateData);

    // Get updated template
    const updatedTemplate = await db.findById('Templet', id);

    res.json({
      success: true,
      message: 'تم تحديث القالب بنجاح',
      data: updatedTemplate
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/stage-templates/:id - حذف قالب
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if template exists
    const template = await db.findById('Templet', id);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'القالب غير موجود',
        code: 'TEMPLATE_NOT_FOUND'
      });
    }

    // Delete template and its stages in transaction
    const queries = [
      {
        sql: 'DELETE FROM StagesTemplet WHERE templateId = ?',
        params: [id]
      },
      {
        sql: 'DELETE FROM Templet WHERE id = ?',
        params: [id]
      }
    ];

    await db.transaction(queries);

    res.json({
      success: true,
      message: 'تم حذف القالب ومراحله بنجاح'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/stage-templates/:id/activate - تفعيل/إلغاء تفعيل قالب
router.put('/:id/activate', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        error: 'حالة التفعيل مطلوبة',
        code: 'IS_ACTIVE_REQUIRED'
      });
    }

    // Check if template exists
    const template = await db.findById('Templet', id);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'القالب غير موجود',
        code: 'TEMPLATE_NOT_FOUND'
      });
    }

    await db.update('Templet', id, {
      isActive: isActive ? 1 : 0,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: isActive ? 'تم تفعيل القالب بنجاح' : 'تم إلغاء تفعيل القالب بنجاح'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/stage-templates/stages/:stageId - تحديث مرحلة في قالب
router.put('/stages/:stageId', async (req, res, next) => {
  try {
    const { stageId } = req.params;
    const updateData = { ...req.body };

    // Remove id and timestamps from update data
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.templateId;
    updateData.updatedAt = new Date().toISOString();

    // Check if stage exists
    const stage = await db.findById('StagesTemplet', stageId);
    if (!stage) {
      return res.status(404).json({
        success: false,
        error: 'مرحلة القالب غير موجودة',
        code: 'TEMPLATE_STAGE_NOT_FOUND'
      });
    }

    await db.update('StagesTemplet', stageId, updateData);

    // Get updated stage
    const updatedStage = await db.findById('StagesTemplet', stageId);

    res.json({
      success: true,
      message: 'تم تحديث مرحلة القالب بنجاح',
      data: updatedStage
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/stage-templates/stages/:stageId - حذف مرحلة من قالب
router.delete('/stages/:stageId', async (req, res, next) => {
  try {
    const { stageId } = req.params;

    // Check if stage exists
    const stage = await db.findById('StagesTemplet', stageId);
    if (!stage) {
      return res.status(404).json({
        success: false,
        error: 'مرحلة القالب غير موجودة',
        code: 'TEMPLATE_STAGE_NOT_FOUND'
      });
    }

    await db.delete('StagesTemplet', stageId);

    res.json({
      success: true,
      message: 'تم حذف مرحلة القالب بنجاح'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/stage-templates/:id/stages/reorder - إعادة ترتيب مراحل القالب
router.put('/:id/stages/reorder', async (req, res, next) => {
  try {
    const { id: templateId } = req.params;
    const { stages } = req.body; // Array of {id, order}

    if (!Array.isArray(stages) || stages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'قائمة المراحل مطلوبة',
        code: 'STAGES_REQUIRED'
      });
    }

    // Check if template exists
    const template = await db.get('SELECT id FROM Templet WHERE id = ?', [templateId]);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'القالب غير موجود',
        code: 'TEMPLATE_NOT_FOUND'
      });
    }

    // Update stages in transaction
    const queries = stages.map(stage => ({
      sql: 'UPDATE StagesTemplet SET `order` = ?, updatedAt = ? WHERE id = ? AND templateId = ?',
      params: [stage.order, new Date().toISOString(), stage.id, templateId]
    }));

    await db.transaction(queries);

    res.json({
      success: true,
      message: 'تم إعادة ترتيب مراحل القالب بنجاح'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/stage-templates/categories - جلب فئات القوالب
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await db.all(`
      SELECT category, COUNT(*) as count
      FROM Templet 
      WHERE isActive = 1
      GROUP BY category
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 